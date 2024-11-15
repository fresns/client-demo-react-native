import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { Debug, DebugItem } from "../../components/debug/debug";
import { Divider } from "../../components/divider/divider";
import { GroupItem } from "../../components/groups/group";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./index.store";

export const Groups = observer(() => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();
  addAndRemoveListener();

  if (data.viewType === "tree") {
    if (isLogicEmpty(data.tree)) {
      return null;
    }

    return (
      <ScrollView style={{ flex: 1 }}>
        <Debug title={"展示模式"} records={[{ label: "展示模式", value: "树形模式" }]} />
        <Divider />
        <Debug
          title={"群组类型"}
          records={data.tree.map(
            (item, index) =>
              ({
                label: "名称",
                value: item.name,
                action: "选择",
                onAction: () => {
                  store.onSwitchGroup(index);
                },
              } as DebugItem)
          )}
        />
        <Divider />
        <FlatList
          data={data.treeGroups.slice()}
          extraData={data.treeGroups.slice()}
          keyExtractor={(item, index) => item.gid}
          renderItem={({ item }) => <GroupItem group={item} />}
          ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
          scrollEnabled={false}
        />
      </ScrollView>
    );
  }

  if (data.viewType === "list") {
    if (isLogicEmpty(data.groups)) {
      return null;
    }

    return (
      <FlatList
        data={data.groups.slice()}
        extraData={data.groups.slice()}
        keyExtractor={(item, index) => item.gid}
        renderItem={({ item }) => <GroupItem group={item} />}
        ListHeaderComponent={() => <Debug title={"展示模式"} records={[{ label: "展示模式", value: "列表模式" }]} />}
        ListFooterComponent={() =>
          data.isLoading && <Loading isReachBottom={data.isReachBottom} type={store.tipType} />
        }
        ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
        refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
        onEndReached={store.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }

  return null;
});
