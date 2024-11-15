import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import RenderHtml from "react-native-render-html";
import { navigateSchema } from "../../router/navigate";
import { ScreenName } from "../../router/screen-name";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { CommentInteraction } from "./sections/interaction";

interface Props {
  comment: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const CommentItem: React.FC<Props> = observer((props) => {
  const { comment, interaction = true, records = [] } = props;

  useEffect(() => {
    if (!comment) {
      return;
    }

    let newContent = comment.content;

    if (newContent) {
      // 匹配话题
      newContent = newContent.replace(
        /<a\s+href="(?:[^"]*\/)?([^"]+)"\s+class="fresns_hashtag"\s+target="_blank">([\s\S]*?)<\/a>/gi,
        "<a href={`fresns://jump?page=${ScreenName.HashtagsDetail}&htid=$1`}>$2</a>"
      );

      // 匹配艾特
      newContent = newContent.replace(
        /<a\s+href="(?:[^"]*\/)?([^"]+)"\s+class="fresns_mention"\s+target="_blank">@([\s\S]*?)<\/a>/gi,
        "<a href={`fresns://jump?page=${ScreenName.ProfilePosts}&fsid=$1`}>@$2</a>"
      );

      // 替换用户默认首页
      newContent = newContent.replace(
        "/pages/profile/posts?fsid=",
        `fresns://jump?page=${ScreenName.ProfilePosts}&fsid=`
      );

      // 增加表情图样式
      newContent = newContent.replace(
        /<img\s+src="([^"]+)"\s+class="fresns_sticker"\s+alt="([\s\S]*?)"\s*\/?>/gi,
        '<img src="$1" alt="$2" class="fresns_sticker" style="display:inline-block;transform:scale(0.5);transform-origin:0 0;width:auto;height:auto;vertical-align:middle;"/>'
      );

      comment.content = newContent;
    }
  }, [comment]);

  return (
    <TouchableOpacity>
      <Debug
        title={"评论信息"}
        records={[
          {
            label: "cid",
            value: comment.cid,
            action: "打印",
            onAction: () => console.log(comment),
          },
          {
            label: "内容",
            value: comment.isMarkdown ? (
              <Markdown
                onLinkPress={(href) => {
                  if (href.startsWith("fresns://")) {
                    navigateSchema(href);
                    return false;
                  }
                  return true;
                }}
              >
                {comment.content}
              </Markdown>
            ) : (
              <RenderHtml
                contentWidth={rpx(300)}
                source={{ html: comment.content }}
                renderersProps={{
                  a: {
                    onPress: (event, href, htmlAttribs, target) => {
                      if (href.startsWith("fresns://")) {
                        event.preventDefault();
                        navigateSchema(href);
                      }
                    },
                  },
                }}
              />
            ),
          },
        ].concat(records as any)}
      />
      {interaction && <CommentInteraction comment={comment} />}
    </TouchableOpacity>
  );
});
