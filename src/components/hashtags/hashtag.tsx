import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { HashtagInteraction } from "./sections/interaction";

interface Props {
  hashtag: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const HashtagItem: React.FC<Props> = observer((props) => {
  const { hashtag, interaction = true, records = [] } = props;

  return (
    <TouchableOpacity>
      <Debug
        title={"话题信息"}
        records={[
          {
            label: "htid",
            value: hashtag.htid,
            action: "打印",
            onAction: () => {
              console.log(hashtag);
            },
          },
          {
            label: "名称",
            value: hashtag.name,
          },
          {
            label: "封面图",
            value: <Image style={{ width: rpx(60), height: rpx(60) }} source={{ uri: hashtag.cover }} />,
          },
          {
            label: "描述",
            value: hashtag.description,
          },
          {
            label: "帖子数量",
            value: hashtag.postCount,
          },
        ].concat(records as any)}
      />
      {interaction && <HashtagInteraction hashtag={hashtag} />}
    </TouchableOpacity>
  );
});
