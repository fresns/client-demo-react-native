/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppStore } from "../../../../App.store";
import { rpx } from "../../../helpers/rpx";

interface Props {
  publishLimit: any;
}

export const EditorPublishLimit: React.FC<Props> = observer((props) => {
  const { publishLimit } = props;
  const { fresnsLang } = useAppStore().store.data;

  return (
    <View style={styles.publishLimitWrapper}>
      <View style={styles.publishLimitItem}>
        <Text style={[styles.publishLimitLabel, { color: "red", fontWeight: "bold" }]}>
          {fresnsLang.editorLimitTitle}
        </Text>
      </View>

      <View style={styles.publishLimitItem}>
        <Text style={styles.publishLimitLabel}>{fresnsLang.editorLimitTypeName}</Text>
        <Text style={styles.publishLimitValue}>
          {publishLimit.type === "1" ? fresnsLang.editorLimitType1Desc : fresnsLang.editorLimitType2Desc}
        </Text>
      </View>

      {publishLimit.type === "1" && (
        <View style={styles.publishLimitItem}>
          <Text style={styles.publishLimitLabel}>{fresnsLang.editorLimitDateName}</Text>
          <Text style={styles.publishLimitValue}>{`${publishLimit.periodStart} - ${publishLimit.periodEnd}`}</Text>
        </View>
      )}

      {publishLimit.type === "2" && (
        <View style={styles.publishLimitItem}>
          <Text style={styles.publishLimitLabel}>{fresnsLang.editorLimitCycleName}</Text>
          <Text style={styles.publishLimitValue}>{`${publishLimit.cycleStart} - ${publishLimit.cycleEnd}`}</Text>
        </View>
      )}

      <View style={styles.publishLimitItem}>
        <Text style={styles.publishLimitLabel}>{fresnsLang.editorLimitRuleName}</Text>
        <Text style={styles.publishLimitValue}>
          {publishLimit.rule === "1" ? fresnsLang.editorLimitRule1Desc : fresnsLang.editorLimitRule2Desc}
        </Text>
      </View>

      {publishLimit.tip && (
        <View style={styles.publishLimitItem}>
          <Text style={styles.publishLimitLabel}>{fresnsLang.editorLimitPromptName}</Text>
          <Text style={styles.publishLimitValue}>{publishLimit.tip}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  publishLimitWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  publishLimitItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: rpx(100),
    backgroundColor: "#fff",
    padding: rpx(24),
    borderBottomWidth: rpx(2),
    borderBottomColor: "#eee",
  },
  publishLimitLabel: {},
  publishLimitValue: {
    flex: 1,
    textAlign: "right",
    color: "#999",
    maxWidth: "80%",
  },
});
