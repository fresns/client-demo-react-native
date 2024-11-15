/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { isNil } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./quoted-post.store";

interface Props {
  type: string;
  did: string;
  quotedPid: string;
}

export const EditorQuotedPost: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, []);

  initAndResetStore();

  if (data.isPending || isNil(data.quotedPost)) {
    return null;
  }

  return (
    <View style={styles.quotedPostWrapper}>
      <View style={styles.quotedPostInnerWrapper}>
        <View style={styles.quotedPostTop}>
          <Image style={styles.quotedPostAvatar} source={{ uri: data.quotedPost.author.avatar }}></Image>
          <View style={styles.quotedPostSummary}>
            <Text>{data.newContent}</Text>
          </View>
        </View>
        <View style={styles.quotedDivider}></View>
        <View style={styles.quotedPostGroup}>
          <Text>{data.quotedPost.group.name}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  quotedPostWrapper: {
    backgroundColor: "#FFF",
    paddingTop: rpx(20),
    paddingBottom: rpx(20),
  },
  quotedPostInnerWrapper: {
    marginLeft: rpx(40),
    marginRight: rpx(40),
    backgroundColor: "#eee",
    padding: rpx(18),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    borderRadius: rpx(12),
  },
  quotedPostTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  quotedPostAvatar: {
    width: rpx(80),
    height: rpx(80),
    borderRadius: rpx(8),
  },
  quotedPostSummary: {
    flex: 1,
    marginLeft: rpx(16),
  },
  quotedDivider: {
    width: "100%",
    height: rpx(1),
    backgroundColor: "#999",
    marginTop: rpx(12),
    marginBottom: rpx(12),
  },
  quotedPostGroup: {},
});
