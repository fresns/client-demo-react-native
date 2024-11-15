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
    const viewProfile = await fresnsViewProfileData(this.options.fsid);

    this.setData({
      profile: viewProfile.detail,
      followersYouKnow: viewProfile.followersYouKnow,
      items: viewProfile.items,
      title: viewProfile.detail.nickname,
      listTitle: get(fresnsConfig, "profile_blocking_posts_name"),
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

  onChangeUser = (user: any) => {
    this.interaction.onChangeProfile(this, user);
  };

  addListener() {
    eventManager.on("onChangePost", this.onChangePost);
    eventManager.on("onChangeUser", this.onChangeUser);
  }

  removeListener() {
    eventManager.off("onChangePost", this.onChangePost);
    eventManager.off("onChangeUser", this.onChangeUser);
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

    const res = await fresnsApi.user.markList(this.data.profile.fsid, "block", "posts", {
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

    if (res.code === 0) {
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
