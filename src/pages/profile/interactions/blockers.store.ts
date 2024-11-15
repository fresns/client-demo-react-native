import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { Interaction } from "../../../mixins/interaction";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsViewProfileData } from "../../../../sdk/helpers/profiles";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { BasicStore } from "../../../../sdk/utilities";

class Data {
  title: string;

  profile: any;
  followersYouKnow: any;
  items: any;

  listTitle: string;

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
    const viewProfile = await fresnsViewProfileData(this.options.fsid);

    this.setData({
      profile: viewProfile.detail,
      followersYouKnow: viewProfile.followersYouKnow,
      items: viewProfile.items,
      title: viewProfile.detail.nickname,
      listTitle: get(fresnsConfig, "profile_blockers_name"),
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

  onChangeUsers = (user: any) => {
    this.interaction.onChangeUser(this, user);
  };

  onChangeUser = (user: any) => {
    this.interaction.onChangeProfile(this, user);
  };

  addListener() {
    eventManager.on("onChangeUser", this.onChangeUser);
    eventManager.on("onChangeUser", this.onChangeUsers);
  }

  removeListener() {
    eventManager.off("onChangeUser", this.onChangeUser);
    eventManager.off("onChangeUser", this.onChangeUsers);
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

    const res = await fresnsApi.user.interaction(this.data.profile.fsid, "blockers", {
      filterType: "whitelist",
      filterKeys:
        "fsid,uid,username,url,nickname,nicknameColor,avatar,decorate,bioHtml,verified,verifiedIcon,roleName,roleNameDisplay,roleIcon,roleIconDisplay,stats,operations,interaction",
      page: this.data.page,
    });

    if (res.code === 0) {
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
