/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store"; // Jevan Note: store
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store"; // Jevan Note: store
import { fresnsEditor } from "../../../helpers/configs";
import { fresnsApi } from "../../../services/api";

class Data {
  isPending: boolean = true;

  placeholder: string;
  title: string;

  config: any = {};
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  props: {
    type: string;
    did: string;
    title: string;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    const { type } = this.props;
    const { fresnsLang } = this.appStore.data;
    const langEditorTitle = get(fresnsLang, "editorTitle");
    const langRequired = get(fresnsLang, "required");
    const langOptional = get(fresnsLang, "optional");
    const config = fresnsEditor[type]("editor.title");

    let placeholder = langEditorTitle + " (" + langOptional + ")";
    if (config.required) {
      placeholder = langEditorTitle + " (" + langRequired + ")";
    }

    this.setData({
      isPending: false,
      placeholder: placeholder,
      title: this.props.title,
      config: config,
    });
  }

  async onChangeText(value: string) {
    const cleanedValue = value.replace(/\n/g, "");
    this.setData({
      title: cleanedValue,
    });
  }

  // Content of the most recent submission
  private lastSubmitVal: string = "";

  async onSubmit() {
    const { type, did } = this.props;
    const title = this.data.title;

    if (this.lastSubmitVal !== title) {
      this.lastSubmitVal = title;
      await fresnsApi.editor.draftUpdate(type, did, { title: title });
    }
  }
}

export const useStore = buildStore(() => new Store());
