/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { TextInput } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./title.store";

interface Props {
  type: string;
  did: string;
  title: string;
}

export const EditorTitle: React.FC<Props> = observer((props) => {
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
    // Jevan Note: lang
    <TextInput
      placeholder={"Title"}
      placeholderTextColor="rgba(0, 0, 0, 0.55)"
      style={{
        height: rpx(100),
        backgroundColor: "#fff",
        paddingLeft: rpx(32),
        paddingRight: rpx(32),
      }}
      value={data.title || ""}
      onChangeText={(text) => store.onChangeText(text)}
      onBlur={async (e) => {
        await store.onSubmit();
      }}
    />
  );
});
