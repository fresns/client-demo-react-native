/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomModal } from "../../../components/bottom-modal/bottom-modal";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./mention.store";

interface Props {
  onClose: () => any;
}

export const EditorMention: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();

  return (
    <BottomModal onTouchMask={() => props.onClose()}>
      {/* Jevan Note: lang */}
      <Text style={styles.modalTitle}>Mention</Text>
      <View style={styles.searchBar}>
        <View style={styles.searchBarLeft}>
          <Text style={styles.searchBarLeftLabel}>User</Text>
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
        {data.users.map((user) => {
          return (
            <View
              key={user.fsid}
              style={styles.userItem}
              onTouchEnd={() => {
                store.onSelectUser(user);
                props.onClose();
              }}
            >
              <Image style={styles.userItemImage} source={{ uri: user.image }} />
              <View style={styles.userItemRight}>
                <Text style={styles.userItemRightName}>{user.name}</Text>
                <Text style={styles.userItemRightFsid}>@{user.fsid}</Text>
              </View>
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
  userBlock: {
    display: "flex",
    flexDirection: "column",
  },
  userItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: rpx(24),
    borderBottomWidth: rpx(2),
    borderBottomColor: "#eee",
  },
  userItemImage: {
    width: rpx(80),
    height: rpx(80),
  },
  userItemRight: {
    marginLeft: rpx(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  userItemRightName: {},
  userItemRightFsid: {
    marginTop: rpx(8),
    color: "#999",
  },
});
