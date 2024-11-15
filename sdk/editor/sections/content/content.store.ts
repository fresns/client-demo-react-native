/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { computed, observable, toJS } from "mobx";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { useAppStore } from "../../../../App.store"; // Jevan Note: store
import { ToastMessage } from "../../../components/message/toast-message";
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store"; // Jevan Note: store
import { EApiCode } from "../../../api";
import { fresnsEditor } from "../../../helpers/configs";
import { fresnsApi } from "../../../services/api";
import { useEditorStore } from "../../editor.store";

class Data {
  isPending: boolean = true;

  placeholder: string;
  content: string;

  config: any = {};

  cursorPosition: number = 0;

  isEnableAnonymous: boolean = false;
  anonymousText: string = "Anonymous"; // Jevan Note: lang

  name: string;
  selectText: string = "Location"; // Jevan Note: lang

}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  props: {
    type: string;
    did: string;
    content: string;
    isAnonymous: boolean;
    locationInfo: any;
    geotag: any;
  };

  @computed get contentLength() {
    return toJS(this.data.content || "").replaceAll("\n", "").length;
  }

  async init() {
    if (isNil(this.props)) {
      this.setData({
        isPending: false,
      });
      return;
    }

    const { fresnsLang } = this.appStore.data;
    const { type, content } = this.props;
    const config = await fresnsEditor[type]("editor");

    const { locationInfo, geotag } = this.props;
    let name = locationInfo?.name;
    if (geotag) {
      name = geotag.name;
    }

    this.setData({
      isPending: false,
      placeholder: get(fresnsLang, "editorContent"),
      content,
      config,
      isEnableAnonymous: this.props.isAnonymous,
      anonymousText: get(fresnsLang, "editorAnonymous"),
      name: name,
      selectText: get(this.appStore.data.fresnsLang, "editorLocation"),
    });
  }

  addListener(): any {
    this.editorStore.emitter.on("onInsertContent", this.onEditorInsert.bind(this));
  }

  removeListener(): any {
    this.editorStore.emitter.off("onInsertContent", this.onEditorInsert.bind(this));
  }

  async onChange(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const text = (e.nativeEvent.text as string) || "";
    this.setData({
      content: text,
    });

    const { config } = this.data;
    if (config.mention.status && text.endsWith("@")) {
      this.editorStore.eventDialogShow("mention");
    }
    if (config.hashtag.status && text.endsWith("#")) {
      this.editorStore.eventDialogShow("hashtag");
    }
  }

  // Content of the most recent submission
  private lastSubmitVal: string = "";

  async onSubmit() {
    const { type, did } = this.props;
    const content = this.data.content;

    if (this.lastSubmitVal !== content) {
      this.lastSubmitVal = content;
      await fresnsApi.editor.draftUpdate(type, did, { content: content });
    }
  }

  /**
   * Elsewhere click on the Insert command
   */
  async onEditorInsert(text: string) {
    let { content, cursorPosition } = this.data;
    if (isNil(content)) {
      content = "";
    }

    if (text.charAt(0) === content.charAt(cursorPosition - 1)) {
      text = text.slice(1);
    }
    this.setData({
      content: content.slice(0, cursorPosition) + text + content.slice(cursorPosition),
    });
  }

  async onSwitchAnonymous() {
    const isAnonymous = !this.data.isEnableAnonymous;
    const { type, did } = this.props;

    const res = await fresnsApi.editor.draftUpdate(type, did, {
      isAnonymous: isAnonymous,
    });

    if (res.code === EApiCode.Success) {
      this.setData({
        isEnableAnonymous: !this.data.isEnableAnonymous,
      });
    }
  }

  onSelectLocation() {
    ToastMessage.info({ title: "Map components require custom development" });
  }
}

export const useStore = buildStore(() => new Store());
