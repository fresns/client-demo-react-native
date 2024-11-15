/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React, { useRef } from "react";
import { WebView as NativeWebView } from "react-native-webview";
import { useSetNavigationTitle } from "../../../src/hooks/use-set-navigation-title";
import { Loading } from "../../components/loading/loading";
import { isLogicEmpty } from "../../utilities/toolkit";
import { useWebviewStore } from "./web-view.store";

interface Props {}

const injectedJavaScript = `
  (function() {
  })();
  true;
`;

export const WebView: React.FC<Props> = observer(() => {
  const webviewRef = useRef(null);
  const { store, initAndResetStore } = useWebviewStore();
  const { url, title } = store.data;

  useSetNavigationTitle(title);
  initAndResetStore();

  if (isLogicEmpty(url)) {
    return <Loading />;
  }

  console.log("web-view url:", url);

  return (
    <NativeWebView
      ref={webviewRef}
      source={{ uri: url }}
      style={{ flex: 1 }}
      injectedJavaScript={injectedJavaScript}
      onMessage={store.handleMessage.bind(store)}
    />
  );
});
