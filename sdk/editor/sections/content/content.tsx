/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./content.store";

interface Props {
  type: string;
  did: string;
  content: string;
  isAnonymous: boolean;
  geotag: any;
  locationInfo: any;
}

export const EditorContent: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore, addAndRemoveListener } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();
  addAndRemoveListener();

  if (data.isPending) {
    return null;
  }

  return (
    <View>
      <TextInput
        multiline={true}
        maxLength={20000}
        style={styles.content}
        value={data.content || ""}
        onChange={(e) => {
          store.onChange(e);
        }}
        onSelectionChange={(e) => {
          const { selection } = e.nativeEvent;
          store.setData({
            cursorPosition: selection.start,
          });
        }}
        onBlur={() => {
          store.onSubmit();
        }}
      />
      <View style={styles.contentBottomBar}>
        <View style={styles.contentBottomAnonymous}>
          <View onTouchEnd={() => store.onSwitchAnonymous()}>
            {data.isEnableAnonymous ? (
              <MaterialCommunityIcons name="checkbox-intermediate" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="black" />
            )}
          </View>
          <Text>{data.anonymousText || "Anonymous"}</Text>
        </View>
        <View style={styles.contentBottomLocation} onTouchEnd={() => store.onSelectLocation()}>
          <Text>{data.selectText || "Location"}</Text>
        </View>
        <View>
          <Text>{store.contentLength}/20000</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    minHeight: rpx(320),
    backgroundColor: "#fff",
    paddingLeft: rpx(32),
    paddingRight: rpx(32),
  },
  contentBottomBar: {
    height: rpx(100),
    backgroundColor: "#fff",
    paddingLeft: rpx(32),
    paddingRight: rpx(32),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentBottomAnonymous: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentBottomLocation: {
    width: rpx(160),
    paddingTop: rpx(8),
    paddingBottom: rpx(8),
    borderColor: "#000",
    borderWidth: rpx(2),
    textAlign: "center",
    borderRadius: rpx(8),
    fontSize: rpx(24),
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
