/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { EApiCode } from "../api";
import { fresnsApi } from "../services/api";
import { Cache } from "./cache";
import { fresnsAuth } from "./fresns-auth";

export async function fresnsAccount(key?: string) {
  if (!(await fresnsAuth.isAccountLogin())) {
    return null;
  }

  let account = await Cache.get<any>("fresnsAccountData");
  if (isNil(account)) {
    const res = await fresnsApi.account.detail();
    if (res.code === EApiCode.Success) {
      account = res.data;
      await Cache.put("fresnsAccountData", account);
    }
  }

  if (isNil(key)) {
    return account;
  } else {
    return get(account, key);
  }
}

export async function fresnsUser(key?: string) {
  if (!(await fresnsAuth.isAccountLogin())) {
    return null;
  }

  let user = await Cache.get<any>("fresnsUserData");
  if (isNil(user)) {
    const res = await fresnsApi.user.detail(await fresnsAuth.uid());
    if (res.code === EApiCode.Success) {
      user = res.data;
      await Cache.put("fresnsUserData", user);
    }
  }

  if (isNil(key)) {
    return user;
  } else {
    return get(user, key);
  }
}

export async function fresnsOverview(key?: string, uid?: string) {
  if (!(await fresnsAuth.isAccountLogin())) {
    return null;
  }

  let cacheKey = "fresnsUserOverview";
  if (!isNil(uid) && (await fresnsAuth.uid()) !== uid) {
    cacheKey = `${cacheKey}_${uid}`;
  }

  let overview = await Cache.get(cacheKey);
  if (isNil(overview)) {
    const res = await fresnsApi.user.overview({
      uidOrUsername: uid,
    });
    if (res.code === EApiCode.Success) {
      overview = res.data;
      await Cache.put(cacheKey, overview, 1, "fresnsCacheOverviewTags");
    }
  }

  if (isNil(key)) {
    return overview;
  } else {
    return get(overview, key);
  }
}

export async function fresnsViewProfilePath(fsid?: string) {
  // Jevan Note
  return null;
}

export async function fresnsViewProfileData(uidOrUsername: string, key?: string) {
  let profile = await Cache.get<any>("fresnsViewProfileData");
  if (isNil(profile) || profile?.detail?.fsid !== uidOrUsername) {
    const res = await fresnsApi.user.detail(uidOrUsername);
    if (res.code === EApiCode.Success) {
      profile = {
        ...res.data,
        followersYouKnow: [],
      };
      if (await fresnsAuth.isUserLogin()) {
        const followRes = await fresnsApi.user.followersYouKnow(uidOrUsername);
        if (followRes.code === EApiCode.Success) {
          profile.followersYouKnow = followRes.data.list;
        }
      }
    }
    await Cache.put("fresnsViewProfileData", profile);
  }

  if (isNil(key)) {
    return profile;
  } else {
    return get(profile, key);
  }
}
