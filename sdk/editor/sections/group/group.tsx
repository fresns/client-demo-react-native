/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { AntDesign } from "@expo/vector-icons";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomModal } from "../../../components/bottom-modal/bottom-modal";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./group.store";

interface Props {
  type: string;
  did: string;
  group: any;
}

export const EditorGroup: React.FC<Props> = observer((props) => {
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
    <View>
      <View style={styles.groupBlock} onTouchEnd={() => store.setData({ selectDialog: true })}>
        {/* Jevan Note: lang */}
        <Text style={styles.groupBlockLeft}>Group</Text>
        <Text style={styles.groupBlockCenter}>{data.currentGroupName || "Unselected"}</Text>
        <AntDesign name="right" size={24} color="black" />
      </View>

      {data.selectDialog && (
        <BottomModal
          onTouchMask={() => {
            store.setData({ selectDialog: false });
          }}
        >
          <ScrollView style={{ height: rpx(800) }}>
            {/* Jevan Note: lang */}
            <Text style={styles.modalTitle}>Group</Text>
            <View
              style={{
                width: "100%",
                backgroundColor: "#eee",
                height: rpx(2),
                marginTop: rpx(20),
              }}
            ></View>
            <View style={styles.groupItem} onTouchEnd={() => store.onClickNoGroup()}>
              {/* Jevan Note: lang */}
              <Text style={styles.groupItemText}>Not to be published in any group</Text>
              <View style={styles.groupItemSelect}>
                <Text style={styles.groupItemSelectText}>Select</Text>
              </View>
            </View>
            {data.currentParentInfo?.gid && (
              <View style={styles.groupItem} onTouchEnd={() => store.onClickGoBack(data.currentParentInfo.gid)}>
                <AntDesign name="left" size={24} color="black" />
                <Text style={styles.groupItemText}>{data.currentParentInfo.name}</Text>
              </View>
            )}
            {data.currentGroups.map((v) => {
              return (
                <View
                  key={v.gid}
                  style={styles.groupItem}
                  onTouchEnd={async () => {
                    if (v.subgroupCount === 0) {
                      await store.selectGroup(v);
                    } else {
                      await store.loadSubGroups(v);
                    }
                  }}
                >
                  {v.cover ? (
                    <Image style={styles.groupItemCover} source={{ uri: v.cover }} />
                  ) : (
                    <View style={styles.groupItemCover}></View>
                  )}
                  <Text style={styles.groupItemText}>{v.name}</Text>
                  {v.subgroupCount === 0 ? (
                    <View style={styles.groupItemSelect}>
                      {/* Jevan Note: lang */}
                      <Text style={styles.groupItemSelectText}>Select</Text>
                    </View>
                  ) : (
                    <AntDesign name="right" size={24} color="black" />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </BottomModal>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  groupBlock: {
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
  groupBlockLeft: {
    fontWeight: "bold",
  },
  groupBlockCenter: {
    flex: 1,
    textAlign: "right",
  },
  modalTitle: {
    width: "100%",
    textAlign: "center",
    fontSize: rpx(32),
    fontWeight: "bold",
    marginBottom: rpx(32),
  },
  groupItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: rpx(100),
    borderBottomWidth: rpx(2),
    borderBottomColor: "#eee",
  },
  groupItemCover: {
    width: rpx(40),
    height: rpx(40),
  },
  groupItemText: {
    flex: 1,
    fontSize: rpx(32),
    marginLeft: rpx(10),
  },
  groupItemSelect: {
    width: rpx(120),
    height: rpx(60),
    borderRadius: rpx(8),
    backgroundColor: "green",
    textAlign: "center",
    fontSize: rpx(32),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  groupItemSelectText: {
    color: "#FFF",
  },
});
