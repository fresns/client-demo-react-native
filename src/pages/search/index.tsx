import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, TextInput, View } from "react-native";
import { CommentItem } from "../../components/comments/comment";
import { Debug } from "../../components/debug/debug";
import { GeotagItem } from "../../components/geotags/geotag";
import { GroupItem } from "../../components/groups/group";
import { HashtagItem } from "../../components/hashtags/hashtag";
import { PostItem } from "../../components/posts/post";
import { UserItem } from "../../components/users/user";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./index.store";

export const Search = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();

  return (
    <View>
      <Debug
        title={"类型切换"}
        records={[
          {
            label: "typename",
            value: store.typeName,
          },
          {
            label: "类型",
            value: "user",
            action: "切换",
            onAction: () => store.switchType("user"),
          },
          {
            label: "类型",
            value: "group",
            action: "切换",
            onAction: () => store.switchType("group"),
          },
          {
            label: "类型",
            value: "hashtag",
            action: "切换",
            onAction: () => store.switchType("hashtag"),
          },
          {
            label: "类型",
            value: "geotag",
            action: "切换",
            onAction: () => store.switchType("geotag"),
          },
          {
            label: "类型",
            value: "post",
            action: "切换",
            onAction: () => store.switchType("post"),
          },
          {
            label: "类型",
            value: "comment",
            action: "切换",
            onAction: () => store.switchType("comment"),
          },
        ]}
      />
      <Debug
        title={"搜索区域"}
        records={[
          {
            label: "搜索框",
            value: (
              <TextInput
                value={data.inputVal}
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                onChangeText={(text) => store.setData({ inputVal: text })}
              />
            ),
            action: "搜索",
            onAction: () => {
              store.confirmSearch();
            },
          },
          {
            label: "操作",
            value: "",
            action: "清除",
            onAction: () => {
              store.clearInput();
            },
          },
        ]}
      />
      {!isLogicEmpty(data.users) && (
        <FlatList
          data={data.users.slice()}
          extraData={data.users.slice()}
          keyExtractor={(item, index) => item.uid}
          renderItem={({ item }) => <UserItem user={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      {!isLogicEmpty(data.groups) && (
        <FlatList
          data={data.groups.slice()}
          extraData={data.groups.slice()}
          keyExtractor={(item, index) => item.gid}
          renderItem={({ item }) => <GroupItem group={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      {!isLogicEmpty(data.hashtags) && (
        <FlatList
          data={data.hashtags.slice()}
          extraData={data.hashtags.slice()}
          keyExtractor={(item, index) => item.htid}
          renderItem={({ item }) => <HashtagItem hashtag={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      {!isLogicEmpty(data.geotags) && (
        <FlatList
          data={data.geotags.slice()}
          extraData={data.geotags.slice()}
          keyExtractor={(item, index) => item.gtid}
          renderItem={({ item }) => <GeotagItem geotag={item} />}
          ListFooterComponent={() =>
            data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
          }
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
          onEndReached={store.onEndReached}
          onEndReachedThreshold={0.1}
        />
      )}
      {!isLogicEmpty(data.posts) && (
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
      {!isLogicEmpty(data.comments) && (
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
