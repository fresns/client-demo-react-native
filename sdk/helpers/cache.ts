/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { isArray, isNil } from "lodash";

export class Cache {
  static async put(key: string, data: any, expire?: number, tag?: string) {
    if (isNil(data)) {
      return;
    }

    await this.setStorage(key, data, expire);

    if (!isNil(tag)) {
      await this.tag(tag, key);
    }
  }

  static async get<T>(key: string) {
    return await this.getStorage<T>(key);
  }

  static async delete(key: string) {
    return await AsyncStorage.removeItem(key);
  }

  static async clearByTag(tag: string) {
    const cachedKeys = await this.getStorage<string[]>(tag);
    await AsyncStorage.multiRemove(cachedKeys || []);
  }

  private static async tag(tag: string, key: string) {
    let cachedKeys = await this.getStorage<string[]>(tag);

    if (isArray(cachedKeys)) {
      if (!cachedKeys.includes(key)) {
        await this.setStorage(tag, cachedKeys.concat(key));
      }
    } else {
      await this.setStorage(tag, [key]);
    }
  }

  private static async setStorage(key: string, value: any, expire?: number) {
    if (isNil(expire)) {
      // expire = (await fresnsConfig('cache_minutes', 3)) as number
      expire = 3;
    }

    await AsyncStorage.setItem(key, JSON.stringify({ value, expire: new Date().valueOf() + expire * 60 * 1000 }));
  }

  private static async getStorage<T>(key: string) {
    try {
      const res = await AsyncStorage.getItem(key);
      if (res) {
        const { value, expire } = JSON.parse(res) as { value: T; expire: number | null };
        if (!isNil(expire) && expire < new Date().valueOf()) {
          return null;
        }
        return value;
      }

      return null;
    } catch (err) {
      console.error(`getStorage failed, key: ${key}`, err);
      return null;
    }
  }
}
