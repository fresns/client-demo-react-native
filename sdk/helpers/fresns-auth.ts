/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { isNil } from "lodash";
import { Cache } from "./cache";

class AuthInfo {
  async aid(): Promise<string> {
    return await Cache.get("aid");
  }

  async aidToken(): Promise<string> {
    return await Cache.get("aidToken");
  }

  async uid(): Promise<string> {
    return await Cache.get("uid");
  }

  async uidToken(): Promise<string> {
    return await Cache.get("uidToken");
  }

  async isAccountLogin() {
    return !isNil(await this.aid()) && !isNil(await this.aidToken());
  }

  async isUserLogin() {
    return (
      !isNil(await this.aid()) &&
      !isNil(await this.aidToken()) &&
      !isNil(await this.uid()) &&
      !isNil(await this.uidToken())
    );
  }
}

export const fresnsAuth = new AuthInfo();
