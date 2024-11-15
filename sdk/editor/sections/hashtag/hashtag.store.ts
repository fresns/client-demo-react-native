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
import { fresnsEditor } from "../../../helpers/configs";
import { fresnsApi } from "../../../services/api";
import { useEditorStore } from "../../editor.store";

class Data {
  title: string;
  placeholder: string;
  barWords: string;
  cancel: string;
  format: number = 1;

  inputVal: string = "";

  hashtags: any[] = [];
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  async init() {
    const format = await fresnsEditor.post("editor.hashtag.format");
    const { fresnsConfig, fresnsLang } = this.appStore.data;

    this.setData({
      title: get(fresnsLang, "editorHashtag"),
      placeholder: get(fresnsLang, "search"),
      barWords: get(fresnsConfig, "user_name"),
      cancel: get(fresnsLang, "cancel"),
      format: format,
    });
  }

  async search() {
    const res = await fresnsApi.common.inputTips({
      type: "hashtag",
      key: this.data.inputVal,
    });
    if (res.code === EApiCode.Success) {
      this.setData({
        hashtags: res.data,
      });
    }
  }

  onSelectHashtag(hashtag: any) {
    if (hashtag.name) {
      let text = "#" + hashtag.name + " ";
      if (this.data.format == 2) {
        text = "#" + hashtag.name + "#";
      }
      this.editorStore.emitter.emit("onInsertContent", text);
    }
  }
}

export const useStore = buildStore(() => new Store());
