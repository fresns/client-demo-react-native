import { useNavigation } from "@react-navigation/native";
import { isNil } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { useAboutStore } from "./about.store";

export const PortalAbout = observer(() => {
  const { store, initAndResetStore } = useAboutStore();
  initAndResetStore();

  const { title, intro } = store.data;
  const navigation = useNavigation();

  useEffect(() => {
    if (!isNil(title)) {
      navigation.setOptions({ title: title });
    }
  }, [title]);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} bounces={true}>
      {!isNil(intro) && <Markdown>{intro}</Markdown>}
    </ScrollView>
  );
});
