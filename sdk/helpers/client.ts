/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { Platform } from "react-native";
import env from "../../env";
import { base64_encode } from "../utilities/base64";
import { Cache } from "./cache";

class Client {
  isIOS() {
    return Platform.OS === "ios";
  }

  isAndroid() {
    return Platform.OS === "android";
  }

  platformId() {
    return env.clientPlatformId;
  }

  version() {
    return env.clientVersion || "3.0.0";
  }

  async langTag() {
    const langTag = await Cache.get<string>("langTag");
    if (!!langTag) {
      return langTag;
    }
    return "zh_CN";
  }

  async deviceInfo(): Promise<string> {
    const deviceInfoBase64 = await Cache.get<string>("deviceInfoBase64");
    if (deviceInfoBase64) {
      return deviceInfoBase64;
    }

    return base64_encode('{"agent":"ReactNative","networkIpv4":"127.0.0.1"}');
  }
}

export const fresnsClient = new Client();
