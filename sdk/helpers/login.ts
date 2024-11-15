/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { EApiCode } from "../api";
import { fresnsApi } from "../services/api";
import { Cache } from "./cache";

class Login {
  async login(loginToken: string) {
    const loginRes = await fresnsApi.account.login({ loginToken });

    if (loginRes.code != 0) {
      return loginRes;
    }

    await Cache.put("aid", loginRes.data.authToken.aid);
    await Cache.put("aidToken", loginRes.data.authToken.aidToken);
    await Cache.put("uid", loginRes.data.authToken.uid);
    await Cache.put("uidToken", loginRes.data.authToken.uidToken);

    await Cache.put("fresnsAccountData", loginRes.data, 5);

    const userRes = await fresnsApi.user.detail(loginRes.data.authToken.uid);

    if (userRes.code === EApiCode.Success) {
      await Cache.put("fresnsUserData", userRes.data, 5);
    }

    return userRes;
  }

  async logout() {
    await Cache.delete("aid");
    await Cache.delete("aidToken");
    await Cache.delete("uid");
    await Cache.delete("uidToken");
    await Cache.delete("fresnsAccountData");
  }

  async switchUser(uidOrUsername: string, pin: string = null, deviceToken: string = null) {
    const loginRes = await fresnsApi.user.login({
      uidOrUsername,
      pin,
      deviceToken,
    });

    if (loginRes.code != EApiCode.Success) {
      return loginRes;
    }

    await Cache.put("aid", loginRes.data.authToken.aid);
    await Cache.put("aidToken", loginRes.data.authToken.aidToken);
    await Cache.put("uid", loginRes.data.authToken.uid);
    await Cache.put("uidToken", loginRes.data.authToken.uidToken);

    const userRes = await fresnsApi.user.detail(uidOrUsername);

    if (userRes.code === EApiCode.Success) {
      await Cache.put("fresnsUserData", userRes.data, 5);
    }

    return userRes;
  }
}

export const fresnsLogin = new Login();
