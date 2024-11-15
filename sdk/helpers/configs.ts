/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { fresnsApi } from "../services/api";
import { Cache } from "./cache";

interface FresnsConfigData {
  [key: string]: any;
}

// fresnsConfig
export async function fresnsConfig(key: string | null = null, defaultValue: any = null): Promise<any> {
  let configData = await Cache.get<FresnsConfigData>("fresnsConfigs");

  // The data has already been verified in the init phase and must be present here.
  if (isNil(configData)) {
    console.error(`Unexpected error: fresnsConfigs isNil`);
    return null;
  }

  if (isNil(key)) {
    return configData;
  }

  return get(configData, `${key}`, defaultValue);
}

// fresnsLang
export async function fresnsLang(key: string | null = null, defaultValue: any = null): Promise<any> {
  let languagePack: Record<string, any> | null = await Cache.get("fresnsLanguagePack");

  // The data has already been verified in the init phase and must be present here.
  if (isNil(languagePack)) {
    console.error(`Unexpected error: fresnsConfigs isNil`);
    return null;
  }

  if (!key) {
    return languagePack;
  }

  return get(languagePack, key, defaultValue);
}

// // fresnsChannels
// export async function fresnsChannels (): Promise<any> {
//   let channels: any | null = cacheGet('fresnsChannels')
//
//   if (!channels) {
//     const result = await fresnsApi.global.channels()
//
//     if (result.code === 0) {
//       cachePut('fresnsChannels', result.data)
//       channels = result.data
//     }
//   }
//
//   return channels
// }
//
// // fresnsContentTypes
// export async function fresnsContentTypes (type: string): Promise<any[]> {
//   if (type !== 'post' && type !== 'comment') {
//     return []
//   }
//
//   let cacheKey = 'fresnsContentTypes_' + type
//
//   let contentTypes: any | null = cacheGet(cacheKey)
//
//   if (!contentTypes) {
//     const result = await fresnsApi.global.contentTypes(type)
//
//     if (result.code === 0) {
//       cachePut(cacheKey, result.data)
//       contentTypes = result.data
//     }
//   }
//
//   return contentTypes
// }
//
// fresnsEditor
export const fresnsEditor = {
  // post
  async post(key: string | null = null): Promise<any> {
    let configData: any | null = await Cache.get("fresnsEditorPost");

    if (!configData) {
      const result = await fresnsApi.editor.configs("post");

      if (result.code === 0) {
        await Cache.put("fresnsEditorPost", result.data);
        configData = result.data;
      }
    }

    if (!key) {
      return configData;
    }

    return get(configData, key);
  },

  // comment
  async comment(key: string | null = null): Promise<any> {
    let configData: any | null = await Cache.get("fresnsEditorComment");

    if (!configData) {
      const result = await fresnsApi.editor.configs("comment");

      if (result.code === 0) {
        await Cache.put("fresnsEditorComment", result.data);
        configData = result.data;
      }
    }

    if (!key) {
      return configData;
    }

    return get(configData, key);
  },

  // stickers
  async stickers(): Promise<any> {
    let stickers: any | null = await Cache.get("fresnsEditorStickers");

    if (!stickers) {
      const result = await fresnsApi.global.stickers();

      if (result.code === 0) {
        await Cache.put("fresnsEditorStickers", result.data);
        stickers = result.data;
      }
    }

    return stickers;
  },
};
//
// // fresnsSticky
// export const fresnsSticky = {
//   // posts
//   async posts (gid: string | null = null): Promise<any> {
//     let cacheKey = 'fresnsStickyPosts'
//     let stickyState = 3
//     if (gid) {
//       cacheKey = 'fresnsStickyPosts_group_' + gid
//       stickyState = 2
//     }
//
//     let stickyPosts: any | null = cacheGet(cacheKey)
//
//     if (!stickyPosts) {
//       const result = await fresnsApi.post.list({
//         stickyState: stickyState,
//       })
//
//       if (result.code === 0) {
//         cachePut(cacheKey, result.data, 10, 'fresnsCacheTags')
//         stickyPosts = result.data
//       }
//     }
//
//     return stickyPosts
//   },
//
//   // comments
//   async comments (pid: string): Promise<any> {
//     let cacheKey = 'fresnsStickyComments_' + pid
//
//     let stickyComments: any | null = cacheGet(cacheKey)
//
//     if (!stickyComments) {
//       const result = await fresnsApi.comment.list({
//         pid: pid,
//         sticky: 1,
//       })
//
//       if (result.code === 0) {
//         cachePut(cacheKey, result.data, 10, 'fresnsCacheTags')
//         stickyComments = result.data
//       }
//     }
//
//     return stickyComments
//   },
// }
