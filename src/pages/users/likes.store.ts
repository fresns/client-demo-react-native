import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { EApiCode } from "../../../sdk/api";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsAuth } from "../../../sdk/helpers/fresns-auth";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  users: any[] = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private interaction = new Interaction();

  async init() {
    const { fresnsConfig } = this.appStore.data;
    this.setData({
      title: get(fresnsConfig, "channel_likes_users_name"),
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
    if (this.data.isReachBottom) {
      return;
    }

    await this.loadData();
  }, 5000);

  onChangeUser = (newUser: any) => {
    this.interaction.onChangeUser(this, newUser);
  };

  addListener() {
    eventManager.on("onChangeUser", this.onChangeUser);
  }

  removeListener() {
    eventManager.off("onChangeUser", this.onChangeUser);
  }

  @computed get tipType() {
    const { users, isReachBottom } = this.data;
    if (isReachBottom) {
      return users.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.user.markList(await fresnsAuth.uid(), "like", "users", {
      filterType: "whitelist",
      filterKeys:
        "fsid,uid,username,url,nickname,nicknameColor,avatar,decorate,bioHtml,verified,verifiedIcon,roleName,roleNameDisplay,roleIcon,roleIconDisplay,stats,operations,interaction",
      page: this.data.page,
    });

    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      this.setData({
        users: this.data.users.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
