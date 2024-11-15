/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store"; // Jevan Note: file
import { BasicStore } from "../../../utilities";
import { navigate } from "../../../../src/router/navigate"; // Jevan Note: file
import { ScreenName } from "../../../../src/router/screen-name"; // Jevan Note: file
import { buildStore } from "../../../../src/store"; // Jevan Note: file

class Data {
  isPending: boolean = true;
  fresnsLang: any;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  props: {
    type: string;
    did: string;
    readConfig: any;
  };

  init() {
    const { fresnsLang } = this.appStore.data;
    this.setData({ isPending: false, fresnsLang: fresnsLang });
  }

  onClickModify() {
    const { type, did, readConfig } = this.props;
    navigate(ScreenName.WebView, {
      title: get(this.data.fresnsLang, "editorReadConfigTitle"),
      url: readConfig.appUrl,
      draftType: type,
      did: did,
      postMessageKey: "expandEdit",
    });
  }
}

export const useStore = buildStore(() => new Store());
