/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store";
import { EApiCode } from "../../../api";
import { fresnsApi } from "../../../services/api";
import { useEditorStore } from "../../editor.store";

class Data {
  title: string;
  placeholder: string;
  barWords: string;
  cancel: string;

  inputVal: string = "";

  users: any[] = [];
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  init() {
    const { fresnsConfig, fresnsLang } = this.appStore.data;
    this.setData({
      title: get(fresnsLang, "editorMention"),
      placeholder: get(fresnsLang, "search"),
      barWords: get(fresnsConfig, "user_name"),
      cancel: get(fresnsLang, "cancel"),
    });
  }

  async search() {
    const res = await fresnsApi.common.inputTips({
      type: "user",
      key: this.data.inputVal,
    });
    if (res.code === EApiCode.Success) {
      this.setData({
        users: res.data,
      });
    }
  }

  onSelectUser(user: any) {
    if (user.fsid) {
      this.editorStore.emitter.emit("onInsertContent", `@${user.fsid} `);
    }
  }
}

export const useStore = buildStore(() => new Store());
