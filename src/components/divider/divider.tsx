import React from "react";
import { View } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";

interface Props {
  margin?: number;
}

export const Divider: React.FC<Props> = (props) => {
  return (
    <View
      style={{
        width: "100%",
        height: rpx(10),
        backgroundColor: "#e9e9e9",
        marginVertical: rpx(10),
        alignSelf: "center",
      }}
    ></View>
  );
};
