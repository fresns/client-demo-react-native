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

  geotags: any[] = [];

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
      listTitle: get(fresnsConfig, "profile_dislikes_geotags_name"),
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

  onChangeGeotag = (geotag: any) => {
    this.interaction.onChangeGeotag(this, geotag);
  };

  onChangeUser = (user: any) => {
    this.interaction.onChangeProfile(this, user);
  };

  addListener() {
    eventManager.on("onChangeGeotag", this.onChangeGeotag);
    eventManager.on("onChangeUser", this.onChangeUser);
  }

  removeListener() {
    eventManager.off("onChangeGeotag", this.onChangeGeotag);
    eventManager.off("onChangeUser", this.onChangeUser);
  }

  @computed get tipType() {
    const { geotags, isReachBottom } = this.data;
    if (isReachBottom) {
      return geotags.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.user.markList(this.data.profile.fsid, "dislike", "geotags", {
      filterType: "whitelist",
      filterKeys:
        "gtid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction",
      page: this.data.page,
    });

    if (res.code === 0) {
      const { pagination, list } = res.data;
      this.setData({
        geotags: this.data.geotags.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
