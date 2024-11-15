/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observable } from "mobx";
import { WebViewMessageEvent } from "react-native-webview/src/WebViewTypes";
import { messageCallback } from "../../../src/mixins/message-callback"; // Jevan Note: mixins
import { BasicStore } from "../../utilities";
import { buildStore } from "../../../src/store"; // Jevan Note: store
import { getHeaders } from "../../api/tool/header";
import { base64_encode } from "../../utilities/base64";

class Data {
  title: string;
  url: string;
}

class WebViewStore extends BasicStore<Data> {
  @observable data = new Data();

  async init() {
    const options: { title: string; url: string; [key: string]: any } = this.options;
    const urlParams = {
      accessToken: await this.makeAccessToken(),
      postMessageKey: options.postMessageKey || "",
      redirectUrl: options.redirectUrl || "",
      connectPlatformId: options.connectPlatformId || "",
      aid: options.aid || "",
      uid: options.uid || "",
      rid: options.rid || "",
      gid: options.gid || "",
      htid: options.htid || "",
      gtid: options.gtid || "",
      pid: options.pid || "",
      cid: options.cid || "",
      fid: options.fid || "",
      eid: options.eid || "",
      hpid: options.hpid || "",
      hcid: options.hcid || "",
      viewType: options.viewType || "",
      draftType: options.draftType || "",
      draftOptions: options.draftOptions || "",
      did: options.did || "",
      uploadInfo: options.uploadInfo || "",
      mapInfo: options.mapInfo || "",
      parameter: options.parameter || "",
    };
    const url = this.replaceUrlParams(options.url, urlParams);

    console.log(`webview url: ${url}`);

    this.setData({
      title: options.title,
      url: url,
    });
  }

  /**
   * The message here can be received and processed directly while the page is running, without having to wait to go to another page.
   *
   * Message formats that require immediate processing can be defined here and processed natively in the
   *
   * @param event
   */
  async handleMessage(event: WebViewMessageEvent) {
    console.log("web-view receive message");
    if (!!event.nativeEvent.data) {
      console.log("web-view receive data:", event.nativeEvent.data);
      await messageCallback.postMessage(JSON.parse(event.nativeEvent.data));
    }
  }

  private async makeAccessToken() {
    const headers = await getHeaders();
    delete headers["Accept"];

    const headersStr = JSON.stringify(headers).replace(/[\n\r]/g, "");
    const base64Encoded = base64_encode(headersStr);
    return encodeURIComponent(base64Encoded);
  }

  private replaceUrlParams(url: string, params: Record<string, any>) {
    let updatedUrl = decodeURIComponent(url);

    for (const key in params) {
      const value = params[key];
      const placeholder = `{${key}}`;

      updatedUrl = updatedUrl.replace(placeholder, value);
    }

    return updatedUrl;
  }
}

export const useWebviewStore = buildStore(() => new WebViewStore());
