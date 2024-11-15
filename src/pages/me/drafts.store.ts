import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { EApiCode } from "../../../sdk/api";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  tabs: any[] = [];

  type: any;

  drafts: any[] = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsConfig } = this.appStore.data;
    this.setData({
      title: get(fresnsConfig, "menu_editor_drafts"),
      type: this.options.type || "post",
      tabs: [
        { text: get(fresnsConfig, "post_name"), type: "post" },
        { text: get(fresnsConfig, "comment_name"), type: "comment" },
      ],
    });
    await this.loadData();
  }

  reset(): any {
    this.data = new Data();
  }

  onRefresh = throttle(async () => {
    this.reset();
    this.setData({ isRefreshing: true });
    await this.init();
    this.setData({ isRefreshing: false });
  }, 5000);

  onEndReached = throttle(async () => {
    if (this.data.isReachBottom || this.data.isLoading) {
      return;
    }

    await this.loadData();
  }, 1500);

  async onSwitchType(type: string) {
    this.setData({ type: type, drafts: [], page: 1 });
    await this.loadData();
  }

  @computed get tipType() {
    const { drafts, isReachBottom } = this.data;
    if (isReachBottom) {
      return drafts.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.editor.draftList(this.data.type, {
      page: this.data.page,
    });

    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      this.setData({
        drafts: this.data.drafts.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
