/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

// Retrieve values from multidimensional arrays or objects using “dot notation” based on specified keys.
export function dataGet(data: any, key: string, defaultValue: any = null): any {
  const keys = key.split(".");

  let value = data;
  for (let i = 0, n = keys.length; i < n; i++) {
    let k = keys[i];

    if (value == null || !(k in value)) {
      return defaultValue;
    }

    value = value[k];
  }

  return value === undefined ? defaultValue : value;
}

// Convert URL query parameters into a JSON object.
export function parseUrlParams(urlParams: string = ""): Record<string, string> {
  if (!urlParams) {
    return {};
  }
  let paramsObj: Record<string, string> = {};
  let paramsArr = urlParams.split("&");
  for (let i = 0; i < paramsArr.length; i++) {
    let param = paramsArr[i].split("=");
    paramsObj[param[0]] = param[1];
  }
  return paramsObj;
}

// Replace group information in the tree structure.
export function replaceGroupTreeInfo(tree: any, gid: string, newGroup: any): any {
  if (tree.gid === gid) {
    return newGroup;
  }

  if (tree.groups) {
    for (let i = 0; i < tree.groups.length; i++) {
      let result = replaceGroupTreeInfo(tree.groups[i], gid, newGroup);
      if (result !== tree.groups[i]) {
        // The matching node has been found and replaced.
        tree.groups[i] = result;
      }
    }
  }

  return tree;
}

// Extract and filter the text content.
export function truncateText(text: string = "", length: number, richText: boolean = false): string {
  if (!text) {
    return text;
  }

  let strippedText = text;

  // Filter out HTML tags and line breaks.
  if (!richText) {
    strippedText = text.replace(/(<([^>]+)>)/gi, "").replace(/(\r\n|\n|\r)/gm, "");
  }

  // Extract a string of a specified length.
  const truncatedText = strippedText.substring(0, length);

  // If the string is truncated, append an ellipsis.
  if (strippedText.length > length) {
    return truncatedText + "...";
  }

  return truncatedText;
}

// Generate a random string.
export function generateRandomString(length: number = 8): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

// Check if the value is null, undefined, an empty object, or an empty array.
export function isLogicEmpty(value: any = null): boolean {
  // Check if the value is null, undefined, or an empty string.
  if (value === undefined || value === null || value === "") return true;

  // Check if the value is an empty array.
  if (Array.isArray(value) && value.length === 0) return true;

  // Check if the value is an empty object.
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return true;

  return false;
}

// Compare two semantic version numbers.
export function versionCompare(clientVersion: string | null = null, remoteVersion: string | null = null): number {
  if (!clientVersion || !remoteVersion) {
    return 0;
  }

  const clientVersions = clientVersion.split(".").map(Number);
  const remoteVersions = remoteVersion.split(".").map(Number);

  // '1.0.1', '1.0.3' = -1
  // '1.0.1', '1.0.0' = 1
  // '1.0.1', '1.0.1' = 0

  for (let i = 0; i < clientVersions.length; i++) {
    if (clientVersions[i] > remoteVersions[i]) {
      return 1;
    } else if (clientVersions[i] < remoteVersions[i]) {
      return -1;
    }
  }

  return 0;
}
