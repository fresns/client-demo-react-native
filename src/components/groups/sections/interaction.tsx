import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../debug/debug";
import { useStore } from "./interaction.store";

interface Props {
  group: any;
}

export const GroupInteraction: React.FC<Props> = observer(({ group }) => {
  const { store } = useStore();

  useEffect(() => {
    store.props = { group };
  }, [group]);

  return (
    <Debug
      title={"行为交互"}
      records={[
        {
          label: "是否 like",
          value: group.interaction.likeStatus,
          action: "切换",
          onAction: store.onClickGroupLike,
        },
        {
          label: "数量 like",
          value: group.likeCount,
        },
        {
          label: "是否 dislike",
          value: group.interaction.dislikeStatus,
          action: "切换",
          onAction: store.onClickGroupDislike,
        },
        {
          label: "数量 dislike",
          value: group.dislikeCount,
        },
        {
          label: "是否 关注",
          value: group.interaction.followStatus,
          action: "切换",
          onAction: store.onClickGroupFollow,
        },
        {
          label: "数量 关注",
          value: group.followCount,
        },
        {
          label: "是否 屏蔽",
          value: group.interaction.blockStatus,
          action: "切换",
          onAction: store.onClickGroupBlock,
        },
        {
          label: "数量 屏蔽",
          value: group.blockCount,
        },
      ]}
    />
  );
  // return (
  //   <View style={styles.markBtn}>
  //     {group.interaction.likeEnabled && (
  //       <TouchableOpacity
  //         style={[styles.button, group.interaction.likeStatus ? styles.buttonPrimary : styles.buttonDefault]}
  //         onPress={store.onClickGroupLike.bind(store)}
  //       >
  //         <Image
  //           style={styles.icon}
  //           source={group.interaction.likeStatus ? buttonIcons.likeActive : buttonIcons.like}
  //         />
  //         <Text style={styles.count}>{group.likeCount || ""}</Text>
  //       </TouchableOpacity>
  //     )}
  //
  //     {group.interaction.dislikeEnabled && (
  //       <TouchableOpacity
  //         style={[styles.button, group.interaction.dislikeStatus ? styles.buttonPrimary : styles.buttonDefault]}
  //         onPress={store.onClickGroupDislike.bind(store)}
  //       >
  //         <Image
  //           style={styles.icon}
  //           source={group.interaction.dislikeStatus ? buttonIcons.dislikeActive : buttonIcons.dislike}
  //         />
  //         <Text style={styles.count}>{group.dislikeCount || ""}</Text>
  //       </TouchableOpacity>
  //     )}
  //
  //     {group.interaction.followEnabled && (
  //       <TouchableOpacity
  //         style={[styles.button, group.interaction.followStatus ? styles.buttonPrimary : styles.buttonDefault]}
  //         onPress={store.onClickGroupFollow.bind(store)}
  //       >
  //         <Image
  //           style={styles.icon}
  //           source={group.interaction.followStatus ? buttonIcons.followActive : buttonIcons.follow}
  //         />
  //         <Text style={styles.count}>{group.followCount || ""}</Text>
  //       </TouchableOpacity>
  //     )}
  //
  //     {group.interaction.blockEnabled && (
  //       <TouchableOpacity
  //         style={[styles.button, group.interaction.blockStatus ? styles.buttonPrimary : styles.buttonDefault]}
  //         onPress={store.onClickGroupBlock.bind(store)}
  //       >
  //         <Image
  //           style={styles.icon}
  //           source={group.interaction.blockStatus ? buttonIcons.blockActive : buttonIcons.block}
  //         />
  //         <Text style={styles.count}>{group.blockCount || ""}</Text>
  //       </TouchableOpacity>
  //     )}
  //   </View>
  // );
});
