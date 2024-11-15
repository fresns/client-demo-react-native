/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import React from "react";
import { Modal, View } from "react-native";

interface Props {
  onTouchMask: () => any;
  children: any;
}

export const BottomModal: React.FC<Props> = (props) => {
  return (
    <Modal visible={true} transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "relative",
        }}
        onTouchEnd={() => {
          typeof props.onTouchMask === "function" && props.onTouchMask();
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "auto",
            padding: 20,
            backgroundColor: "white",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          {props.children}
        </View>
      </View>
    </Modal>
  );
};
