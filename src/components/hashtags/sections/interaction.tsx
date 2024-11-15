import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../debug/debug";
import { useStore } from "./interaction.store";

interface Props {
  hashtag: any;
}

export const HashtagInteraction: React.FC<Props> = observer(({ hashtag }) => {
  const { store } = useStore();

  useEffect(() => {
    store.props = { hashtag };
  }, [hashtag]);

  return (
    <Debug
      title="行为交互"
      records={[
        {
          label: "是否 like",
          value: hashtag.interaction.likeStatus,
          action: "切换",
          onAction: store.onClickHashtagLike,
        },
        {
          label: "数量 like",
          value: hashtag.likeCount,
        },
        {
          label: "是否 dislike",
          value: hashtag.interaction.dislikeStatus,
          action: "切换",
          onAction: store.onClickHashtagDislike,
        },
        {
          label: "数量 dislike",
          value: hashtag.dislikeCount,
        },
        {
          label: "是否 关注",
          value: hashtag.interaction.followStatus,
          action: "切换",
          onAction: store.onClickHashtagFollow,
        },
        {
          label: "数量 关注",
          value: hashtag.followCount,
        },
        {
          label: "是否 屏蔽",
          value: hashtag.interaction.blockStatus,
          action: "切换",
          onAction: store.onClickHashtagBlock,
        },
        {
          label: "数量 屏蔽",
          value: hashtag.blockCount,
        },
      ]}
    />
  );
});
