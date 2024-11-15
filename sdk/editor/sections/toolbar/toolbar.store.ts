/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store"; // Jevan Note: store
import { ToastMessage } from "../../../components/message/toast-message";
import { BasicStore } from "../../../utilities";
import { navigate } from "../../../../src/router/navigate"; // Jevan Note: router
import { ScreenName } from "../../../../src/router/screen-name"; // Jevan Note: router
import { buildStore } from "../../../../src/store"; // Jevan Note: store
import { EApiCode } from "../../../api";
import { fresnsEditor } from "../../../helpers/configs";
import { fresnsApi } from "../../../services/api";
import { useEditorStore } from "../../editor.store";

class Data {
  isPending: boolean = true;

  fresnsLang: any;
  config: any = {};

  stickerDialog: boolean = false;
  stickers: any[] = [];
  currentIndex: number = 0;
  currentStickers: any[] = [];

  extendDialog: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  props: {
    type: string;
    did: string;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    const { fresnsLang } = this.appStore.data;
    const { type } = this.props;
    const config = await fresnsEditor[type]("editor");
    const stickers = await fresnsEditor.stickers();

    this.setData({
      isPending: false,
      fresnsLang: fresnsLang,
      config: config,
      stickers: stickers,
      currentStickers: stickers[0]?.stickers,
    });
  }

  async onClickToolbar(
    tool: "sticker" | "image" | "video" | "audio" | "document" | "title" | "mention" | "hashtag" | "extend"
  ) {
    const { type, did } = this.props;
    const { config } = this.data;
    switch (tool) {
      case "sticker": {
        this.setData({
          stickerDialog: !this.data.stickerDialog,
        });
        break;
      }
      case "image": {
        switch (config.image.uploadMethod) {
          case "api":
            await this.onClickImageUpload();
            break;
          case "page":
            await this.pluginPageUpload(config.image.uploadUrl, `${type}Draft,${did},image`);
            break;
          case "sdk":
            ToastMessage.info({
              title: "Under development",
            });
            break;
        }
        break;
      }
      case "video": {
        switch (config.video.uploadMethod) {
          case "api":
            await this.onClickVideoUpload();
            break;
          case "page":
            await this.pluginPageUpload(config.video.uploadUrl, `${type}Draft,${did},video`);
            break;
          case "sdk":
            ToastMessage.info({
              title: "Under development",
            });
            break;
        }
        break;
      }
      case "audio": {
        switch (config.audio.uploadMethod) {
          case "api":
            await this.onClickAudioUpload();
            break;
          case "page":
            await this.pluginPageUpload(config.audio.uploadUrl, `${type}Draft,${did},audio`);
            break;
          case "sdk":
            ToastMessage.info({
              title: "Under development",
            });
            break;
        }
        break;
      }
      case "document":
        switch (config.document.uploadMethod) {
          case "api":
            await this.onClickDocumentUpload();
            break;
          case "page":
            await this.pluginPageUpload(config.document.uploadUrl, `${type}Draft,${did},document`);
            break;
          case "sdk":
            ToastMessage.info({
              title: "Under development",
            });
            break;
        }
        break;
      case "title": {
        this.editorStore.eventDialogShow("title");
        break;
      }
      case "mention": {
        this.editorStore.eventDialogShow("mention");
        break;
      }
      case "hashtag": {
        this.editorStore.eventDialogShow("hashtag");
        break;
      }
      case "extend": {
        this.setData({ extendDialog: true });
        break;
      }
      default:
        break;
    }
  }

  async switchStickers(index: number) {
    const { stickers } = this.data;
    this.setData({
      currentIndex: index,
      currentStickers: stickers[index].stickers,
    });
  }

  async onSelectSticker(sticker: any) {
    const { codeFormat } = sticker;
    this.editorStore.emitter.emit("onInsertContent", codeFormat);
    this.setData({ stickerDialog: false });
  }

  async goExtendPage(extend: any) {
    const { type, did } = this.props;
    const { name, appUrl } = extend;

    navigate(ScreenName.WebView, {
      title: name,
      url: appUrl,
      draftType: type,
      did: did,
      postMessageKey: "expandEdit",
    });
  }

  private async onClickImageUpload() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      ToastMessage.info({ title: "You've refused to allow this app to access your photos!" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      this.editorStore.eventAddFiles(
        "image",
        result.assets.map((v) => ({
          fid: v.assetId,
          uri: v.uri,
        }))
      );

      await Promise.all(
        result.assets?.map(async (asset) => {
          const { type, did } = this.props;

          const fetchResponse = await fetch(asset.uri);
          const theBlob = await fetchResponse.blob();

          const formData = new FormData();
          formData.append("usageType", `${type}Draft`);
          formData.append("usageFsid", did);
          formData.append("type", "image");
          formData.append("file", theBlob);

          // Start uploading
          this.editorStore.eventUpdateFile("image", { fid: asset.assetId, uri: asset.uri, action: "upload" });
          const res = await fresnsApi.common.fileUpload(formData);
          if (res.code === EApiCode.Success) {
            // Uploaded successfully
            this.editorStore.eventUpdateFile("image", { fid: asset.assetId, uri: asset.uri, action: "done" });
          } else {
            // Upload failed
            this.editorStore.eventUpdateFile("image", { fid: asset.assetId, uri: asset.uri, action: "delete" });
          }
        })
      );
    }
  }

  private async onClickVideoUpload() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      ToastMessage.info({ title: "You've refused to allow this app to access your photos!" });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      this.editorStore.eventAddFiles(
        "video",
        result.assets.map((v) => ({
          fid: v.assetId,
          uri: v.uri,
        }))
      );

      await Promise.all(
        result.assets?.map(async (asset) => {
          const { type, did } = this.props;

          const fetchResponse = await fetch(asset.uri);
          const theBlob = await fetchResponse.blob();

          const formData = new FormData();
          formData.append("usageType", `${type}Draft`);
          formData.append("usageFsid", did);
          formData.append("type", "video");
          formData.append("file", theBlob);

          // Start uploading
          this.editorStore.eventUpdateFile("video", { fid: asset.assetId, uri: asset.uri, action: "upload" });
          const res = await fresnsApi.common.fileUpload(formData);
          if (res.code === EApiCode.Success) {
            // Uploaded successfully
            this.editorStore.eventUpdateFile("video", { fid: asset.assetId, uri: asset.uri, action: "done" });
          } else {
            // Upload failed
            this.editorStore.eventUpdateFile("video", { fid: asset.assetId, uri: asset.uri, action: "delete" });
          }
        })
      );
    }
  }

  private async onClickAudioUpload() {
    let result = await DocumentPicker.getDocumentAsync({
      type: "audio",
    });
    // @ts-ignore
    if (result.type === "success") {
      console.log(result);
    }

    ToastMessage.info({
      title: "Under development",
    });
  }

  private async onClickDocumentUpload() {
    let result = await DocumentPicker.getDocumentAsync({});
    // @ts-ignore
    if (result.type === "success") {
      console.log(result);
    }

    ToastMessage.info({
      title: "Under development",
    });
  }

  private async pluginPageUpload(uploadUrl: string, uploadInfo: any) {
    const { fresnsLang } = this.appStore.data;
    navigate(ScreenName.WebView, {
      title: get(fresnsLang, "upload"),
      url: uploadUrl,
      uploadInfo: uploadInfo,
      postMessageKey: "fresnsEditorUpload",
    });
  }
}

export const useStore = buildStore(() => new Store());
