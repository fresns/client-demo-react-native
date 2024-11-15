import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";

export interface DebugItem {
  label: string;
  value: any;
  action?: string;
  onAction?: () => any;
}

const DebugItem: React.FC<DebugItem> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}：</Text>
      <View style={styles.value}>
        {typeof props.value !== "object" ? <Text>{String(props.value)}</Text> : props.value}
      </View>
      <Text style={styles.action} onPress={() => props.onAction?.()}>
        {props.action}
      </Text>
    </View>
  );
};

export const Debug: React.FC<{ title: string; records: DebugItem[] }> = (props) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={1}>
      <DebugItem {...item} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={props.records}
      renderItem={renderItem}
      ListHeaderComponent={() => {
        return <Text style={[styles.container, { fontWeight: "bold" }]}>{props.title}</Text>;
      }}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    minHeight: rpx(60),
    paddingHorizontal: rpx(20),
    paddingVertical: rpx(10),
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: rpx(2),
    borderBottomColor: "#c5c5c5",
  },
  label: {
    width: rpx(200),
  },
  value: {
    flex: 1,
  },
  action: {
    width: rpx(150),
    textAlign: "center",
  },
});
