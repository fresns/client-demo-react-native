import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { EApiCode } from "../../../sdk/api";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../sdk/services/api";
import { parseUrlParams } from "../../../sdk/utilities/toolkit";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  requestState: any = null;
  requestQuery: any = null;

  geotags: any = [];

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
    let requestState = get(fresnsConfig, "channel_geotag_list_query_state");
    let requestQuery = parseUrlParams(get(fresnsConfig, "channel_geotag_list_query_config"));

    if (requestState === 3) {
      Object.assign(requestQuery, this.options);
    }

    this.setData({
      title: get(fresnsConfig, "channel_geotag_list_name"),
      requestState: requestState,
      requestQuery: requestQuery,
    });
    await this.loadData();
  }

  reset() {
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

  onChangeGeotag = (newHashtag: any) => {
    this.interaction.onChangeGeotag(this, newHashtag);
  };

  addListener() {
    eventManager.on("onChangeGeotag", this.onChangeGeotag);
  }

  removeListener() {
    eventManager.off("onChangeGeotag", this.onChangeGeotag);
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
    const listRes = await fresnsApi.geotag.list(
      Object.assign(this.data.requestQuery, {
        filterType: "whitelist",
        filterKeys:
          "gtid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction",
        page: this.data.page,
      })
    );
    if (listRes.code === EApiCode.Success) {
      const { pagination, list } = listRes.data;

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
