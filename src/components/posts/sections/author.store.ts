import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../../sdk/utilities";
import { buildStore } from "../../../store";

class Data {
  isPending: boolean = true;

  // FIXME 原生场景考虑路径问题
  userProfilePath: string;

  userDeactivate: any;
  authorAnonymous: any;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  init() {
    const { fresnsLang } = this.appStore.data;
    this.setData({
      isPending: false,
      userDeactivate: get(fresnsLang, "userDeactivate"),
      authorAnonymous: get(fresnsLang, "contentAuthorAnonymous"),
    });
  }
}

export const useStore = buildStore(() => new Store());
