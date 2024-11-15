import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import RenderHtml from "react-native-render-html";
import { navigateSchema } from "../../router/navigate";
import { ScreenName } from "../../router/screen-name";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { PostInteraction } from "./sections/interaction";

interface Props {
  post: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const PostItem: React.FC<Props> = observer((props) => {
  const { post, interaction = true, records = [] } = props;

  useEffect(() => {
    if (!post) {
      return;
    }

    let newContent = post.content;

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

      post.content = newContent;
    }
  }, [post]);

  return (
    <TouchableOpacity>
      <Debug
        title={"帖子信息"}
        records={[
          {
            label: "pid",
            value: post.pid,
            action: "打印",
            onAction: () => console.log(post),
          },
          {
            label: "作者",
            value: post.author.nickname,
          },
          {
            label: "标题",
            value: post.title,
          },
          {
            label: "内容",
            value: post.isMarkdown ? (
              <Markdown
                onLinkPress={(href) => {
                  if (href.startsWith("fresns://")) {
                    navigateSchema(href);
                    return false;
                  }
                  return true;
                }}
              >
                {post.content}
              </Markdown>
            ) : (
              <RenderHtml
                contentWidth={rpx(300)}
                source={{ html: post.content }}
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
      {interaction && <PostInteraction post={post} />}
    </TouchableOpacity>
  );
});
