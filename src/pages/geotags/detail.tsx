import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { CommentItem } from "../../components/comments/comment";
import { GeotagItem } from "../../components/geotags/geotag";
import { PostItem } from "../../components/posts/post";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./detail.store";

export const GeotagsDetail = observer(() => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();
  addAndRemoveListener();

  if (data.detailType === "posts") {
    if (isLogicEmpty(data.posts)) {
      return data.geotag && <GeotagItem geotag={data.geotag} />;
    }

    return (
      <FlatList
        data={data.posts.slice()}
        extraData={data.posts.slice()}
        keyExtractor={(item, index) => item.pid}
        renderItem={({ item }) => <PostItem post={item} />}
        ListHeaderComponent={() => data.geotag && <GeotagItem geotag={data.geotag} />}
        ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
        ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
        refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
        onEndReached={store.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }

  if (data.detailType === "comments") {
    if (isLogicEmpty(data.comments)) {
      return data.geotag && <GeotagItem geotag={data.geotag} />;
    }

    return (
      <FlatList
        data={data.comments.slice()}
        extraData={data.comments.slice()}
        keyExtractor={(item, index) => item.cid}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={() => data.geotag && <GeotagItem geotag={data.geotag} />}
        ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
        ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
        refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
        onEndReached={store.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }

  return <Text>类型错误</Text>;
});
