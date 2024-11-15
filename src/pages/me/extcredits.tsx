import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Debug } from "../../components/debug/debug";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./extcredits.store";

const ExtCreditItem: React.FC<{ extCredit: any }> = ({ extCredit }) => {
  return (
    <Debug
      title={"扩展积分"}
      records={[
        {
          label: "类型",
          value: extCredit.type,
          action: "打印",
          onAction: () => console.log(extCredit),
        },
        {
          label: "金额",
          value: extCredit.amount,
        },
      ]}
    />
  );
};

export const MeExtCredits = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);
  initAndResetStore();

  if (isLogicEmpty(data.records)) {
    return null;
  }

  return (
    <FlatList
      data={data.records}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item }) => <ExtCreditItem extCredit={item} />}
      ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
      refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
      onEndReached={store.onEndReached}
      onEndReachedThreshold={0.1}
    />
  );
});
