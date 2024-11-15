import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, Modal, View } from "react-native";
import { rpx } from "../../../../sdk/helpers/rpx";
import { Debug } from "../../debug/debug";
import { useStore } from "./interaction.store";

interface Props {
  comment: any;
  viewType?: "list" | "detail" | string;
}

export const CommentInteraction: React.FC<Props> = observer(({ comment }) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = { comment };
  }, [comment]);

  return (
    <>
      <Debug
        title={"行为交互"}
        records={[
          {
            label: "是否 like",
            value: comment.interaction.likeStatus,
            action: "切换",
            onAction: store.onClickCommentLike,
          },
          {
            label: "数量 like",
            value: comment.likeCount,
          },
          {
            label: "是否 dislike",
            value: comment.interaction.dislikeStatus,
            action: "切换",
            onAction: store.onClickCommentDislike,
          },
          {
            label: "数量 dislike",
            value: comment.dislikeCount,
          },
          {
            label: "是否 关注",
            value: comment.interaction.followStatus,
            action: "切换",
            onAction: store.onClickCommentFollow,
          },
          {
            label: "数量 关注",
            value: comment.followCount,
          },
          {
            label: "是否 屏蔽",
            value: comment.interaction.blockStatus,
            action: "切换",
            onAction: store.onClickCommentBlock,
          },
          {
            label: "数量 屏蔽",
            value: comment.blockCount,
          },
          {
            label: "分享",
            value: "点击分享",
            action: "分享",
            onAction: store.onClickSharePoster,
          },
        ]}
      />
      <Debug
        title={"扩展功能"}
        records={comment.manages.map((item) => {
          return {
            label: "名称",
            value: item.name,
            action: "点击",
            onAction: () => store.onClickExtend(item),
          };
        })}
      />

      <Modal visible={data.showShareModal} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Debug
              title={"海报分享"}
              records={[
                {
                  label: "图片",
                  value: <Image style={{ width: rpx(100), height: rpx(100) }} source={{ uri: data.sharePoster }} />,
                },
                { label: "下载", value: "下载图片", action: "下载", onAction: () => store.saveSharePoster() },
                {
                  label: "取消",
                  value: "取消",
                  action: "取消",
                  onAction: () => store.setData({ showShareModal: false }),
                },
              ]}
            />
          </View>
        </View>
      </Modal>
    </>
  );
});
