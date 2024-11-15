import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Debug } from "../../components/debug/debug";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { useStore } from "./drafts.store";

const DraftItem: React.FC<{ draft: any }> = ({ draft }) => {
  return (
    <Debug
      title={"草稿"}
      records={[
        {
          label: "内容",
          value: draft.content,
          action: "打印",
          onAction: () => console.log(draft),
        },
      ]}
    />
  );
};

export const MeDrafts = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);
  initAndResetStore();

  return (
    <FlatList
      data={data.drafts}
      keyExtractor={(item, index) => item.did}
      renderItem={({ item }) => <DraftItem draft={item} />}
      ListHeaderComponent={() => {
        return (
          <Debug
            title={"类型切换"}
            records={[
              {
                label: "当前类型",
                value: data.type,
              },
            ].concat(
              data.tabs.map((tab) => ({
                label: "类型",
                value: tab.text,
                action: "切换",
                onAction: () => store.onSwitchType(tab.type),
              }))
            )}
          />
        );
      }}
      ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
      refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
      onEndReached={store.onEndReached}
      onEndReachedThreshold={0.1}
    />
  );
});
