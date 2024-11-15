import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../../sdk/utilities";
import { buildStore } from "../../../store";

class Data {
  isPending = true;
  contentTopComment = "热评";
  modifierCount = "已";
  contentCommentCountDesc = "条回复";
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  init() {
    const { fresnsLang } = this.appStore.data;
    this.setData({
      isPending: false,
      contentTopComment: get(fresnsLang, "contentTopComment"),
      modifierCount: get(fresnsLang, "modifierCount"),
      contentCommentCountDesc: get(fresnsLang, "contentCommentCountDesc"),
    });
  }
}

export const useStore = buildStore(() => new Store());
