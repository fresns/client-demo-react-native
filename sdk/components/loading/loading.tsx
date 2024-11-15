/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { isNil } from "lodash";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { rpx } from "../../helpers/rpx";
import { useLoadingStore } from "./loading.store";

interface Props {
  isReachBottom?: boolean;
  type?: "none" | "page" | "empty";
}

export const Loading: React.FC<Props> = observer((props) => {
  const { isReachBottom, type } = props;
  const { store } = useLoadingStore();

  useEffect(() => {
    store.onPropsUpdate({ isReachBottom, type });
  }, [isReachBottom, type]);

  const { tips } = store.data;

  return (
    <>
      {!isReachBottom && (
        <View style={styles.container}>
          <View>
            <ActivityIndicator size="small" />
          </View>
          <Text style={{ marginLeft: rpx(12) }}>{tips}</Text>
        </View>
      )}

      {isReachBottom && !isNil(tips) && (
        <View style={styles.container}>
          <Text>{tips}</Text>
        </View>
      )}
    </>
  );
});

Loading.defaultProps = {
  isReachBottom: true,
  type: "none",
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
