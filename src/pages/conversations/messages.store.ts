import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { EApiCode } from "../../../sdk/api";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  // 会话详情
  configs: any;
  detail: any;

  messages: any[] = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsLang } = this.appStore.data;

    const fsid = this.options.fsid;
    const res = await fresnsApi.conversation.detail(fsid, {
      filterUserType: "whitelist",
      filterUserKeys: "fsid,uid,username,nickname,avatar,status",
    });
    if (res.code === EApiCode.Success) {
      let nickname = res.data.detail.user.nickname;
      if (!res.data.detail.user.status) {
        nickname = get(fresnsLang, "userDeactivated");
      }

      this.setData({
        title: nickname,
        configs: res.data.configs,
        detail: res.data.detail,
      });

      await this.loadData();
      await fresnsApi.conversation.markAsRead(fsid);
    } else {
      this.setData({
        title: get(fresnsLang, "errorNoInfo"),
      });
    }
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

  @computed get tipType() {
    const { messages, isReachBottom } = this.data;
    if (isReachBottom) {
      return messages.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.conversation.messages(this.data.detail.user.fsid, {
      filterUserType: "whitelist",
      filterUserKeys: "fsid,uid,username,nickname,nicknameColor,avatar,status",
      page: this.data.page,
    });

    if (res.code === 0) {
      const { pagination, list } = res.data;
      this.setData({
        messages: this.data.messages.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
