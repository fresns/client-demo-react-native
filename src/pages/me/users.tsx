import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { FlatList, View } from "react-native";
import { UserItem } from "../../components/users/user";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { rpx } from "../../../sdk/helpers/rpx";
import { useStore } from "./users.store";

export const MeUsers = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);
  initAndResetStore();

  return (
    <FlatList
      data={data.users}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item }) => (
        <UserItem
          user={item}
          interaction={false}
          records={[
            {
              label: "操作",
              value: "切换用户",
              action: "切换",
              onAction: () => {
                store.switchUser(item);
              },
            },
          ]}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: rpx(32) }}></View>}
    />
  );
});
