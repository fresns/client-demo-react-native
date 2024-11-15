import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../debug/debug";
import { useStore } from "./interaction.store";

interface Props {
  geotag: any;
}

export const GeotagInterception: React.FC<Props> = observer(({ geotag }) => {
  const { store } = useStore();

  useEffect(() => {
    store.props = { geotag };
  }, [geotag]);

  return (
    <Debug
      title="行为交互"
      records={[
        {
          label: "是否 like",
          value: geotag.interaction.likeStatus,
          action: "切换",
          onAction: store.onClickGeotagLike,
        },
        {
          label: "数量 like",
          value: geotag.likeCount,
        },
        {
          label: "是否 dislike",
          value: geotag.interaction.dislikeStatus,
          action: "切换",
          onAction: store.onClickGeotagDislike,
        },
        {
          label: "数量 dislike",
          value: geotag.dislikeCount,
        },
        {
          label: "是否 关注",
          value: geotag.interaction.followStatus,
          action: "切换",
          onAction: store.onClickGeotagFollow,
        },
        {
          label: "数量 关注",
          value: geotag.followCount,
        },
        {
          label: "是否 屏蔽",
          value: geotag.interaction.blockStatus,
          action: "切换",
          onAction: store.onClickGeotagBlock,
        },
        {
          label: "数量 屏蔽",
          value: geotag.blockCount,
        },
      ]}
    />
  );
});
