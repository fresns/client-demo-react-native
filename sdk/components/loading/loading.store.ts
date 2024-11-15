/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observable } from "mobx";
import { BasicStore } from "../../utilities";
import { buildStore } from "../../../src/store"; // Jevan Note: store
import { fresnsLang } from "../../helpers/configs";

class Data {
  tips: string;
}

export class LoadingStore extends BasicStore<Data> {
  @observable data = new Data();

  async onPropsUpdate(options: { isReachBottom: boolean; type: "none" | "page" | "empty" | string }) {
    const { isReachBottom, type } = options;
    if (!isReachBottom) {
      this.setData({ tips: (await fresnsLang("loading")) || "Loading" });
    } else {
      if (type === "none") {
        this.setData({ tips: null });
      }
      if (type === "page") {
        this.setData({ tips: (await fresnsLang("listWithoutPage")) || "There's no more content." });
      }
      if (type === "empty") {
        this.setData({ tips: (await fresnsLang("listEmpty")) || "List is empty, no content for now" });
      }
    }
  }
}

export const useLoadingStore = buildStore(() => new LoadingStore());
