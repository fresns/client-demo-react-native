import { observer } from "mobx-react";
import React from "react";
import Markdown from "react-native-markdown-display";
import { TabView } from "react-native-tab-view";
import { rpx } from "../../../sdk/helpers/rpx";
import { usePoliciesStore } from "./policies.store";

export const PortalPolicies = observer(() => {
  const { store, initAndResetStore } = usePoliciesStore();

  initAndResetStore();

  const { tabIndex, tabs } = store.data;

  return (
    <TabView
      navigationState={{ index: tabIndex, routes: tabs.map((v) => ({ key: v.title, title: v.title })) }}
      renderScene={({ route }) => {
        return <Markdown>{tabs.find((tab) => tab.title === route.title)?.content}</Markdown>;
      }}
      onIndexChange={(index) => {
        store.setData({ tabIndex: index });
      }}
      initialLayout={{ width: rpx(30) }}
    />
  );
});
