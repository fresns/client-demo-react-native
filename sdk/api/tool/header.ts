/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import env from "../../../env";
import { fresnsClient } from "../../helpers/client";
import { fresnsAuth } from "../../helpers/fresns-auth";
import { hash_sha256 } from "../../utilities/sha256";

/**
 * Headers
 * https://docs.fresns.com/clients/reference/headers.html
 */
export async function getHeaders(): Promise<Record<string, string>> {
  const now = new Date(); // Get device local time
  const timezoneOffsetInHours = now.getTimezoneOffset() / -60; // Get the number of hours the time zone is shifted
  const utcTimezone = (timezoneOffsetInHours > 0 ? "+" : "") + timezoneOffsetInHours.toString(); // Get UTC time zone
  const signTimestamp = String(Date.now()); // Get Unix timestamps for the UTC+0 time zone

  const headers: Record<string, string | number | null> = {
    Accept: "application/json",
    "X-Fresns-Space-Id": env.spaceId,
    "X-Fresns-App-Id": env.appId,
    "X-Fresns-Client-Platform-Id": fresnsClient.platformId(),
    "X-Fresns-Client-Version": fresnsClient.version(),
    "X-Fresns-Client-Device-Info": await fresnsClient.deviceInfo(),
    "X-Fresns-Client-Timezone": utcTimezone,
    "X-Fresns-Client-Lang-Tag": await fresnsClient.langTag(),
    "X-Fresns-Client-Content-Format": null,
    "X-Fresns-Aid": await fresnsAuth.aid(),
    "X-Fresns-Aid-Token": await fresnsAuth.aidToken(),
    "X-Fresns-Uid": await fresnsAuth.uid(),
    "X-Fresns-Uid-Token": await fresnsAuth.uidToken(),
    "X-Fresns-Signature": await makeSignature(signTimestamp),
    "X-Fresns-Signature-Timestamp": signTimestamp,
  };

  for (const key in headers) {
    if (headers[key] === null) {
      delete headers[key];
    }
  }

  return headers as Record<string, string>;
}

/** Make API Signature **/
export async function makeSignature(signTimestamp: string): Promise<string> {
  const headers: Record<string, string | number | null> = {
    "X-Fresns-Space-Id": env.spaceId,
    "X-Fresns-App-Id": env.appId,
    "X-Fresns-Client-Platform-Id": fresnsClient.platformId(),
    "X-Fresns-Client-Version": fresnsClient.version(),
    "X-Fresns-Aid": await fresnsAuth.aid(),
    "X-Fresns-Aid-Token": await fresnsAuth.aidToken(),
    "X-Fresns-Uid": await fresnsAuth.uid(),
    "X-Fresns-Uid-Token": await fresnsAuth.uidToken(),
    "X-Fresns-Signature-Timestamp": signTimestamp,
  };

  const strArr = Object.keys(headers)
    .filter((v) => !!headers[v])
    .sort();

  const stringSignTemp = strArr.map((key) => `${key}=${headers[key]}`).join("&") + `&AppKey=${env.appKey}`;

  return hash_sha256(stringSignTemp);
}
