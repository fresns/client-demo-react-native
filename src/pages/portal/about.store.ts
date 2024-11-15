import { get } from "lodash";
import { observable } from "mobx";
import { Platform } from "react-native";
import { useAppStore } from "../../../App.store";
import { fresnsClient } from "../../../sdk/helpers/client";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title?: string;
  logo?: string;
  intro?: string;
  fresnsVersion?: string;
  clientVersion?: string;
  clientName?: string;
  appBaseInfo?: string;
}

class AboutStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsStatus, fresnsConfig, fresnsLang } = this.appStore.data;

    this.setData({
      title: get(fresnsLang, "about"),
      logo: get(fresnsConfig, "site_logo"),
      intro: get(fresnsConfig, "site_intro"),
      fresnsVersion: get(fresnsStatus, "version"),
      clientVersion: fresnsClient.version(),
      clientName: Platform.OS,
      appBaseInfo: undefined,
    });
  }
}

export const useAboutStore = buildStore(() => new AboutStore());
