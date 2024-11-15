import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string | undefined;
  tabs: { title: string; active: string; content: string }[] = [];
  tabIndex: number = 0;
}

class PoliciesStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsLang, fresnsConfig } = this.appStore.data;

    let tabs = [];
    if (get(fresnsConfig, "account_terms_status")) {
      tabs.push({
        title: get(fresnsLang, "accountPoliciesTerms"),
        active: "terms",
        content: get(fresnsConfig, "account_terms_policy"),
      });
    }
    if (get(fresnsConfig, "account_privacy_status")) {
      tabs.push({
        title: get(fresnsLang, "accountPoliciesPrivacy"),
        active: "privacy",
        content: get(fresnsConfig, "account_privacy_policy"),
      });
    }
    if (get(fresnsConfig, "account_cookie_status")) {
      tabs.push({
        title: get(fresnsLang, "accountPoliciesCookie"),
        active: "cookie",
        content: get(fresnsConfig, "account_cookie_policy"),
      });
    }
    if (get(fresnsConfig, "account_delete_status")) {
      tabs.push({
        title: get(fresnsLang, "accountPoliciesDelete"),
        active: "accountDelete",
        content: get(fresnsConfig, "account_delete_policy"),
      });
    }

    this.setData({
      title: get(fresnsConfig, "accountPolicies"),
      tabs: tabs,
    });
  }
}

export const usePoliciesStore = buildStore(() => new PoliciesStore());
