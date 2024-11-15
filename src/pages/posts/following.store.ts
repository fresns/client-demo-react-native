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

  posts: any[] = [];

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
      title: get(fresnsConfig, "channel_following_posts_name"),
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

  onChangePost = (post: any) => {
    this.interaction.onChangePost(this, post);
  };

  addListener() {
    eventManager.on("onChangePost", this.onChangePost);
  }

  removeListener() {
    eventManager.off("onChangePost", this.onChangePost);
  }

  @computed get tipType() {
    const { posts, isReachBottom } = this.data;
    if (isReachBottom) {
      return posts.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.user.markList(await fresnsAuth.uid(), "follow", "posts", {
      filterType: "blacklist",
      filterKeys: "hashtags,previewLikeUsers,previewComments",
      filterGroupType: "whitelist",
      filterGroupKeys: "gid,name,cover",
      filterGeotagType: "whitelist",
      filterGeotagKeys: "gtid,name,distance,unit",
      filterAuthorType: "whitelist",
      filterAuthorKeys:
        "fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations",
      filterQuotedPostType: "whitelist",
      filterQuotedPostKeys: "pid,title,content,contentLength,author.nickname,author.avatar,author.status",
      page: this.data.page,
    });

    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      this.setData({
        posts: this.data.posts.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
