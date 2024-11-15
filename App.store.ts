import { isNil } from "lodash";
import { observable } from "mobx";
import { ModalMessage } from "./src/components/message/modal-message";
import { BasicStore } from "./sdk/utilities";
import { EApiCode } from "./sdk/api";
import { Cache } from "./sdk/helpers/cache";
import { fresnsApi } from "./sdk/services/api";
import { buildStoreGlobal } from "./src/store";

class Data {
  isLoading: boolean = true;

  fresnsStatus: any = {};
  fresnsConfig: any = {};
  fresnsLang: any = {};
}

export class AppStore extends BasicStore<Data> {
  @observable.ref data = new Data();

  async init() {
    try {
      await Promise.all([this.confirmAppStatus(), this.confirmAppConfig(), this.confirmAppLang()]);
    } finally {
      this.setData({ isLoading: false });
    }
  }

  async switchLangTag(langTag) {
    this.setData({ isLoading: true });
    try {
      await Cache.put("langTag", langTag);
      await Cache.delete("fresnsLanguagePack");
      await Cache.delete("fresnsConfigs");
      await Cache.delete("fresnsUserData");
      await Promise.all([this.confirmAppConfig(), this.confirmAppLang()]);
    } finally {
      this.setData({ isLoading: false });
    }
  }

  private async confirmAppStatus() {
    const langTag = await Cache.get<string>("langTag");

    const res = await fresnsApi.global.status();
    this.setData({ fresnsStatus: res });

    if (res.activate === false) {
      let describe = langTag ? res.deactivateDescribe[langTag] : res.deactivateDescribe.default;
      ModalMessage.show({
        title: "公告",
        content: describe,
      });
    }
  }

  private async confirmAppConfig() {
    let config = await Cache.get<any>("fresnsConfigs");

    if (isNil(config)) {
      const res = await fresnsApi.global.configs();
      if (res.code === EApiCode.Success) {
        config = res.data;

        const expire = res.data.cache_minutes || 30;
        await Cache.put("fresnsConfigs", config, expire);
      }
    }

    this.setData({ fresnsConfig: config });
  }

  private async confirmAppLang() {
    let lang = await Cache.get<any>("fresnsLanguagePack");
    if (isNil(lang)) {
      const res = await fresnsApi.global.languagePack();
      if (res.code === EApiCode.Success) {
        lang = res.data;
        await Cache.put("fresnsLanguagePack", lang);
      }
    }

    this.setData({ fresnsLang: lang });
  }
}

export const useAppStore = buildStoreGlobal(() => new AppStore(), "AppStore");
