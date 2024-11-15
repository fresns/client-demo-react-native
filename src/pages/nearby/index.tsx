import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { CommentItem } from "../../components/comments/comment";
import { Debug } from "../../components/debug/debug";
import { ToastMessage } from "../../components/message/toast-message";
import { PostItem } from "../../components/posts/post";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./index.store";

export const Nearby = observer(() => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();
  addAndRemoveListener();

  return (
    <View>
      <Debug
        title={"位置选择"}
        records={[
          {
            label: "经度",
            value: data.longitude,
            action: "切换定位",
            onAction: () => {
              ToastMessage.info({ title: "地图组件需自定义开发" });
            },
          },
          {
            label: "纬度",
            value: data.latitude,
          },
        ]}
      />
      {data.detailType === "posts" && !isLogicEmpty(data.posts) && (
        <FlatList
          data={data.posts.slice()}
          extraData={data.posts.slice()}
          keyExtractor={(item, index) => item.pid}
          renderItem={({ item }) => <PostItem post={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      {data.detailType === "comments" && !isLogicEmpty(data.comments) && (
        <FlatList
          data={data.comments.slice()}
          extraData={data.comments.slice()}
          keyExtractor={(item, index) => item.cid}
          renderItem={({ item }) => <CommentItem comment={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
});
