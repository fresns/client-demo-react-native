import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { CommentItem } from "../../components/comments/comment";
import { PostItem } from "../../components/posts/post";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./detail.store";

export const PostsDetail = observer(() => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();
  addAndRemoveListener();

  if (isLogicEmpty(data.comments)) {
    return data.post && <PostItem post={data.post} />;
  }

  return (
    <FlatList
      data={data.comments.slice()}
      extraData={data.comments.slice()}
      keyExtractor={(item, index) => item.cid}
      renderItem={({ item }) => <CommentItem comment={item} />}
      ListHeaderComponent={() => data.post && <PostItem post={data.post} />}
      ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
      refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
      onEndReached={store.onEndReached}
      onEndReachedThreshold={0.1}
    />
  );
});