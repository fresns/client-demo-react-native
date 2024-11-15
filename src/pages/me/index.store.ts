import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { fresnsAuth } from "../../../sdk/helpers/fresns-auth";
import { fresnsAccount, fresnsOverview, fresnsUser } from "../../../sdk/helpers/profiles";
import { navigate } from "../../router/navigate";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  accountLoginUrl: string;
  accountRegisterUrl: string;
  fresnsConfig: any;
  accountLogin: boolean;
  userLogin: boolean;
  fresnsLang: any;
  fresnsAccount: any;
  fresnsUser: any;
  fresnsOverview: any;
}

class MeStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsConfig, fresnsLang } = this.appStore.data;

    this.setData({
      title: get(fresnsConfig, "channel_me_name"),
      fresnsLang: fresnsLang,
      fresnsConfig: fresnsConfig,
      accountLoginUrl: get(fresnsConfig, "account_login_service"),
      accountRegisterUrl: get(fresnsConfig, "account_register_service"),
      accountLogin: await fresnsAuth.isAccountLogin(),
      userLogin: await fresnsAuth.isUserLogin(),
      fresnsAccount: await fresnsAccount("detail"),
      fresnsUser: await fresnsUser("detail"),
      fresnsOverview: await fresnsOverview(),
    });
  }

  reset(): any {
    this.data = new Data();
  }

  async onShow() {
    this.setData({
      accountLogin: await fresnsAuth.isAccountLogin(),
      userLogin: await fresnsAuth.isUserLogin(),
      fresnsAccount: await fresnsAccount("detail"),
      fresnsUser: await fresnsUser("detail"),
      fresnsOverview: await fresnsOverview(),
    });
  }

  async switchLangTag(langTag) {
    await this.appStore.switchLangTag(langTag);
    this.setData({
      fresnsUser: await fresnsUser("detail"),
    });
  }

  onClickLogin() {
    navigate("WebView", {
      url: this.data.accountLoginUrl,
      postMessageKey: "fresnsAccountSign",
    });
  }
}

export const useStore = buildStore(() => new MeStore());
