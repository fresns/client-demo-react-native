import { useNavigation } from "@react-navigation/native";
import { isNil } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";
import { usePortalStore } from "./index.store";

export const Portal = observer(() => {
  const { store, initAndResetStore } = usePortalStore();

  initAndResetStore();

  const { title, content } = store.data;
  const navigation = useNavigation();

  useEffect(() => {
    if (!isNil(title)) {
      navigation.setOptions({ title: title });
    }
  }, [title]);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} bounces={true}>
      {!isNil(content) && <Markdown>{content}</Markdown>}
    </ScrollView>
  );
});
