/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { isLogicEmpty } from "../../../utilities/toolkit";

interface Props {
  publishPerm: any;
}

export const EditorPublishPerm: React.FC<Props> = (props) => {
  const { publishPerm } = props;

  if (isLogicEmpty(publishPerm?.tips)) {
    return null;
  }

  return (
    <View style={styles.publishPermWrapper}>
      {publishPerm.tips.map((tip) => {
        return (
          <View style={styles.publishPermItem}>
            <Text style={styles.publishPermText}>{tip}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  publishPermWrapper: {
    display: "flex",
    flexDirection: "column",
    rowGap: rpx(8),
    paddingTop: rpx(40),
  },
  publishPermItem: {
    marginLeft: rpx(40),
    marginRight: rpx(40),
    padding: rpx(20),
    backgroundColor: "#FF4500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rpx(10),
  },
  publishPermText: {
    color: "#fff",
    fontSize: rpx(28),
  },
});
