import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsAuth } from "../../../sdk/helpers/fresns-auth";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  groups: any[] = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class FollowingStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private interaction = new Interaction();

  async init() {
    const { fresnsConfig } = this.appStore.data;
    this.setData({
      title: get(fresnsConfig, "channel_following_groups_name"),
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

  onChangeGroup = (newGroup: any) => {
    this.interaction.onChangeGroup(this, newGroup);
  };

  addListener() {
    eventManager.on("onChangeGroup", this.onChangeGroup);
  }

  removeListener() {
    eventManager.off("onChangeGroup", this.onChangeGroup);
  }

  @computed get tipType() {
    const { groups, isReachBottom } = this.data;
    if (isReachBottom) {
      return groups.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.user.markList(await fresnsAuth.uid(), "follow", "groups", {
      filterType: "blacklist",
      filterKeys: "archives,operations",
      page: this.data.page,
    });

    if (res.code === 0) {
      const { pagination, list } = res.data;
      this.setData({
        groups: this.data.groups.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new FollowingStore());
