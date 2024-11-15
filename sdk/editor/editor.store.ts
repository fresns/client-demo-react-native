/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import EventEmitter from "eventemitter3";
import { get, isNil } from "lodash";
import { observable, toJS } from "mobx";
import { useAppStore } from "../../App.store";
import { ToastMessage } from "../components/message/toast-message";
import { BasicStore } from "../utilities";
import { navigateBack } from "../../src/router/navigate";
import { buildStoreGlobal } from "../../src/store";

import { EApiCode } from "../api";
import { Cache } from "../helpers/cache";
import { fresnsEditor } from "../helpers/configs";
import { fresnsApi } from "../services/api";

export interface EditorEventTypes {
  onInsertContent: (text: string) => any;
}

class Data {
  isPending: boolean = true;

  editorConfig: any = {};

  publishPerm: any;
  publishLimit: any;

  draftSelector: boolean;
  editorForm: boolean = false;

  controls: any = {};
  draftDetail: any;

  type?: string;
  options?: any;
  did?: string;
  fsid?: string;

  archiveGroupConfigs: any[] = [];

  titleInputShow: boolean = false;
  mentionDialogShow: boolean = false;
  hashtagDialogShow: boolean = false;

  publishBtnName: string;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  emitter = new EventEmitter<EditorEventTypes, any>();

  props: {
    type?: string;
    options?: any;
    did?: string;
    fsid?: string;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    this.setData({
      type: this.props.type,
      options: this.props.options,
      did: this.props.did,
      fsid: this.options.fsid,
    });

    const { fresnsConfig } = this.appStore.data;
    const { type } = this.props;
    const config = await fresnsEditor[type]();
    const titleConfig = config.editor.title;
    const publishPerm = config.publish.perm;
    const publishLimit = config.publish.limit;

    // Unable to create drafts, does not show draft selector
    let draftSelector = false;
    if (publishPerm.draft) {
      // You can create drafts and display the draft selector
      draftSelector = true;
    }

    this.setData({
      isPending: false,
      editorConfig: config.editor,
      publishPerm: publishPerm,
      publishLimit: publishLimit,
      draftSelector: draftSelector,
      titleInputShow: titleConfig.required ? true : titleConfig.show,
      publishBtnName: get(fresnsConfig, `publish_${type}_name`),
    });
  }

  async handleCallbackMessage() {
    const callbackMessage: any = await Cache.get("fresnsCallbackMessage");
    if (!callbackMessage) {
      return;
    }

    if (callbackMessage.code !== 0) {
      ToastMessage.error({
        title: `[${callbackMessage.code}] ${callbackMessage.message}`,
      });
      await Cache.delete("fresnsCallbackMessage");
      return;
    }

    const { type, did } = this.props;
    const dataHandler = callbackMessage.action.dataHandler;
    const data = callbackMessage.data;
    switch (callbackMessage.action.postMessageKey) {
      // Draft reloading
      case "expandEdit":
        const detailRes = await fresnsApi.editor.draftDetail(type, did);

        if (detailRes.code == 0) {
          this.setData({
            controls: detailRes.data.controls,
            draftDetail: detailRes.data.detail,
          });
        }
        break;

      // Handling file uploads
      case "fresnsEditorUpload":
        if (dataHandler == "add") {
          const draftDetail = this.data.draftDetail;

          if (data.type == 1) {
            draftDetail.files.images.push(data);
          }

          if (data.type == 2) {
            draftDetail.files.videos.push(data);
          }

          if (data.type == 3) {
            draftDetail.files.audios.push(data);
          }

          if (data.type == 4) {
            draftDetail.files.documents.push(data);
          }

          this.setData({
            draftDetail: draftDetail,
          });
        }
        break;

      default:
        break;
    }
    await Cache.delete("fresnsCallbackMessage");
  }

  async eventGroupChange(group: any) {
    const gid = group.gid;
    if (!gid) {
      this.setData({
        archiveGroupConfigs: [],
      });
      return;
    }
    const { type } = this.data;
    const res = await fresnsApi.global.archives(type, { gid: gid });
    if (res.code === EApiCode.Success) {
      this.setData({
        archiveGroupConfigs: res.data,
      });
    }
  }

  enterEditingMode(draft: any) {
    this.setData({
      draftSelector: false,
      editorForm: true,
      controls: draft.controls,
      draftDetail: draft.detail,
      did: draft.detail.did,
      titleInputShow: !!draft.detail.title,
    });
  }

  eventDialogShow(type: "title" | "mention" | "hashtag" | string) {
    if (type === "title") {
      this.setData({
        titleInputShow: !this.data.titleInputShow,
      });
    }
    if (type === "mention") {
      this.setData({ mentionDialogShow: !this.data.mentionDialogShow });
    }
    if (type === "hashtag") {
      this.setData({ hashtagDialogShow: !this.data.hashtagDialogShow });
    }
  }

  eventAddFiles(type: "image" | "video", files: { fid: string; uri: string }[]) {
    type = type + "s";
    const updatedTempFiles = files.map((file) => ({
      ...file,
      newChoice: true,
      waitingUpload: true,
      filePath: file.uri,
    }));

    const { draftDetail } = toJS(this.data);
    draftDetail.files[type].push(updatedTempFiles);
    this.setData({ draftDetail: draftDetail });
  }

  eventUpdateFile(
    type: "image" | "video",
    file: {
      fid: string;
      uri: string;
      action: "upload" | "done" | "delete";
    }
  ) {
    const { fid, uri, action } = file;
    type = type + "s";

    const draftDetail = this.data.draftDetail;
    const fileArr = draftDetail.files[type];
    const index = fileArr.findIndex((v) => v.filePath === uri);
    if (index === -1) {
      return;
    }

    const fileData = fileArr[index];

    switch (action) {
      case "upload":
        fileData.fid = fid;
        fileData.newChoice = true;
        fileData.waitingUpload = false;

        fileArr[index] = fileData;
        break;

      case "done":
        fileData.fid = fid;
        fileData.newChoice = false;
        fileData.waitingUpload = false;

        fileArr[index] = fileData;
        break;

      case "delete":
        fileArr.splice(index, 1);
        break;
    }

    draftDetail.files[type] = fileArr;

    this.setData({
      draftDetail: draftDetail,
    });
  }

  async onSubmitPublish() {
    const { type, did } = this.data;
    const res = await fresnsApi.editor.draftPublish(type, did);

    // Prohibition of publication
    if (res.code == 36104) {
      ToastMessage.info({
        title: res.message,
        content: res.data.join(" | "),
      });
    }

    // Published successfully, pending review
    if (res.code === 38200) {
      ToastMessage.info({
        title: res.message,
      });
    }

    if (res.code === EApiCode.Success) {
      ToastMessage.info({
        title: res.message,
      });

      navigateBack();
    }
  }
}

export const useEditorStore = buildStoreGlobal(() => new Store(), "EditorStore");
