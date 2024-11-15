/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomModal } from "../../../components/bottom-modal/bottom-modal";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./hashtag.store";

interface Props {
  onClose: () => any;
}

export const EditorHashtag: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();

  return (
    <BottomModal onTouchMask={() => props.onClose()}>
      {/* Jevan Note: lang */}
      <Text style={styles.modalTitle}>Hashtag</Text>
      <View style={styles.searchBar}>
        <View style={styles.searchBarLeft}>
          <Text style={styles.searchBarLeftLabel}>Hashtag</Text>
          <TextInput
            style={styles.searchBarLeftInput}
            placeholder={"Search"}
            value={data.inputVal}
            onSubmitEditing={async () => {
              await store.search();
            }}
            onChangeText={(text) => {
              store.setData({ inputVal: text });
            }}
          />
        </View>
        <Text style={styles.searchBarRight} onPress={() => props.onClose()}>
          Cancel
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: "#eee",
          height: rpx(2),
          marginTop: rpx(20),
          marginBottom: rpx(20),
        }}
      ></View>
      <ScrollView style={{ height: rpx(600) }}>
        {data.hashtags.map((hashtag) => {
          return (
            <View
              key={hashtag.fsid}
              style={styles.hashtagItem}
              onTouchEnd={() => {
                store.onSelectHashtag(hashtag);
                props.onClose();
              }}
            >
              <Text>{hashtag.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </BottomModal>
  );
});

const styles = StyleSheet.create({
  modalTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: rpx(32),
    fontWeight: "bold",
    marginBottom: rpx(32),
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchBarLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#eee",
    borderRadius: rpx(8),
    paddingTop: rpx(8),
    paddingBottom: rpx(8),
    paddingLeft: rpx(12),
    paddingRight: rpx(12),
  },
  searchBarLeftLabel: {
    color: "green",
  },
  searchBarLeftInput: {
    flex: 1,
    height: rpx(40),
    marginLeft: rpx(10),
  },
  searchBarRight: {
    marginLeft: rpx(14),
    color: "#576b95",
  },
  hashtagBlock: {
    display: "flex",
    flexDirection: "column",
  },
  hashtagItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: rpx(24),
    borderBottomWidth: rpx(2),
    borderBottomColor: "#eee",
  },
});
