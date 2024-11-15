import { isNil } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { HashtagItem } from "../../../components/hashtags/hashtag";
import { UserItem } from "../../../components/users/user";
import { useSetNavigationTitle } from "../../../hooks/use-set-navigation-title";
import { Loading } from "../../../../sdk/components/loading/loading";
import { rpx } from "../../../../sdk/helpers/rpx";
import { useStore } from "./hashtags.store";

export const ProfileDislikesHashtags = observer(() => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();
  addAndRemoveListener();

  if (isNil(data.profile)) {
    return null;
  }

  return (
    <FlatList
      data={data.hashtags.slice()}
      extraData={data.hashtags.slice()}
      keyExtractor={(item, index) => item.htid}
      renderItem={({ item }) => <HashtagItem hashtag={item} />}
      ListHeaderComponent={() => <UserItem user={data.profile} />}
      ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
      refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
      onEndReached={store.onEndReached}
      onEndReachedThreshold={0.1}
    />
  );
});
