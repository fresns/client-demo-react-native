import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../debug/debug";
import { useStore } from "./interaction.store";

interface Props {
  user: any;
}

export const UserInteraction: React.FC<Props> = observer(({ user }) => {
  const { store } = useStore();

  useEffect(() => {
    store.props = { user };
  }, [user]);

  return (
    <Debug
      title={"行为交互"}
      records={[
        {
          label: "是否 like",
          value: user.interaction.likeStatus,
          action: "切换",
          onAction: store.onClickUserLike,
        },
        {
          label: "数量 like",
          value: user.stats.likerCount,
        },
        {
          label: "是否 dislike",
          value: user.interaction.dislikeStatus,
          action: "切换",
          onAction: store.onClickUserDislike,
        },
        {
          label: "数量 dislike",
          value: user.stats.dislikerCount,
        },
        {
          label: "是否 关注",
          value: user.interaction.followStatus,
          action: "切换",
          onAction: store.onClickUserFollow,
        },
        {
          label: "数量 关注",
          value: user.stats.followerCount,
        },
        {
          label: "是否 屏蔽",
          value: user.interaction.blockStatus,
          action: "切换",
          onAction: store.onClickUserBlock,
        },
        {
          label: "数量 屏蔽",
          value: user.stats.blockerCount,
        },
      ]}
    />
  );
});
