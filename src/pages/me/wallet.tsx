import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { Debug } from "../../components/debug/debug";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { Loading } from "../../../sdk/components/loading/loading";
import { rpx } from "../../../sdk/helpers/rpx";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { useStore } from "./wallet.store";

const WalletItem: React.FC<{ walletRecord: any }> = ({ walletRecord }) => {
  return (
    <Debug
      title={"钱包信息"}
      records={[
        {
          label: "类型",
          value: walletRecord.type,
          action: "打印",
          onAction: () => console.log(walletRecord),
        },
        {
          label: "金额",
          value: walletRecord.amountTotal,
        },
      ]}
    />
  );
};

export const MeWallet = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);
  initAndResetStore();

  if (isLogicEmpty(data.walletRecords)) {
    return null;
  }

  return (
    <FlatList
      data={data.walletRecords}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item }) => <WalletItem walletRecord={item} />}
      ListFooterComponent={() => <Loading isReachBottom={data.isReachBottom} type={store.tipType} />}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
      refreshControl={<RefreshControl refreshing={data.isRefreshing} onRefresh={store.onRefresh} />}
      onEndReached={store.onEndReached}
      onEndReachedThreshold={0.1}
    />
  );
});
