/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { AntDesign } from "@expo/vector-icons";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./draft-selector.store";

interface Props {
  type: string;
  options: any;
  did?: string;
  fsid?: string;
}

export const EditorDraftSelector: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  return (
    <View style={styles.draftSelectorContainer}>
      <View style={styles.draftCreateContainer}>
        <View style={styles.draftCreate}>
          {/* Jevan Note: lang */}
          <Text style={styles.draftCreateText} onPress={() => store.createDraft()}>
            Creating a new draft
          </Text>
        </View>
      </View>
      <View style={styles.draftOr}>
        {/* Jevan Note: lang */}
        <Text style={styles.draftOrText}>or</Text>
      </View>
      {/* Jevan Note: lang */}
      <Text style={styles.draftSelectTip}>Select a draft from the draft box</Text>
      <FlatList
        data={data.drafts.slice()}
        extraData={data.drafts.slice()}
        keyExtractor={(item, index) => item.did}
        renderItem={({ item }) => (
          <View
            style={styles.draftItem}
            onTouchEnd={() => {
              store.onSelectDraft(item);
            }}
          >
            <Text style={{ width: rpx(300) }}>{item.title || "Empty"}</Text>
            <AntDesign name="right" size={24} color="black" />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: rpx(1) }}></View>}
        onEndReached={store.onEndReached}
        onEndReachedThreshold={0.1}
        scrollEnabled={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  draftSelectorContainer: {
    display: "flex",
    flexDirection: "column",
    paddingTop: rpx(80),
  },
  draftCreateContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  draftCreate: {
    width: rpx(426),
    height: rpx(126),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: rpx(12),
  },
  draftCreateText: {
    color: "#FFF",
    fontSize: rpx(32),
    fontWeight: "bold",
  },
  draftOr: {
    position: "relative",
    alignSelf: "center",
    marginTop: rpx(40),
    marginBottom: rpx(40),
    width: rpx(400),
    height: rpx(2),
    backgroundColor: "grey",
  },
  draftOrText: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -10 }, { translateY: -8 }],
    backgroundColor: "#fff",
  },
  draftSelectTip: {
    width: "100%",
    color: "rgba(0, 0, 0, 0.55)",
    fontSize: rpx(25),
    paddingLeft: rpx(32),
    marginTop: rpx(20),
    marginBottom: rpx(20),
  },
  draftItem: {
    width: "100%",
    height: rpx(100),
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: rpx(32),
    paddingRight: rpx(32),
  },
});
