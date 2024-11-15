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

  hashtags: any = [];

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
    let requestState = get(fresnsConfig, "channel_hashtag_list_query_state");
    let requestQuery = parseUrlParams(get(fresnsConfig, "channel_hashtag_list_query_config"));

    if (requestState === 3) {
      Object.assign(requestQuery, this.options);
    }

    this.setData({
      title: get(fresnsConfig, "channel_hashtag_list_name"),
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

  onChangeHashtag = (newHashtag: any) => {
    this.interaction.onChangeHashtag(this, newHashtag);
  };

  addListener() {
    eventManager.on("onChangeHashtag", this.onChangeHashtag);
  }

  removeListener() {
    eventManager.off("onChangeHashtag", this.onChangeHashtag);
  }

  @computed get tipType() {
    const { hashtags, isReachBottom } = this.data;
    if (isReachBottom) {
      return hashtags.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });
    const listRes = await fresnsApi.hashtag.list(
      Object.assign(this.data.requestQuery, {
        filterType: "whitelist",
        filterKeys:
          "htid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction",
        page: this.data.page,
      })
    );
    if (listRes.code === EApiCode.Success) {
      const { pagination, list } = listRes.data;

      this.setData({
        hashtags: this.data.hashtags.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }
    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
