import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  detailType: string = "posts";

  posts: any[] = [];
  comments: any[] = [];

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
      title: get(fresnsConfig, "channel_timeline_name"),
      detailType: get(fresnsConfig, "channel_timeline_type"),
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

  onChangeComment = (comment: any) => {
    this.interaction.onChangeComment(this, comment);
  };

  addListener() {
    eventManager.on("onChangePost", this.onChangePost);
    eventManager.on("onChangeComment", this.onChangeComment);
  }

  removeListener() {
    eventManager.off("onChangePost", this.onChangePost);
    eventManager.off("onChangeComment", this.onChangeComment);
  }

  @computed get tipType() {
    const { posts, isReachBottom } = this.data;
    if (isReachBottom) {
      return posts.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    const { detailType } = this.data;
    this.setData({ isLoading: true });

    if (detailType === "posts") {
      const res = await fresnsApi.post.timelines({
        filterType: "blacklist",
        filterKeys: "hashtags,previewLikeUsers",
        filterGroupType: "whitelist",
        filterGroupKeys: "gid,name,cover",
        filterGeotagType: "whitelist",
        filterGeotagKeys: "gtid,name,distance,unit",
        filterAuthorType: "whitelist",
        filterAuthorKeys:
          "fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations",
        filterQuotedPostType: "whitelist",
        filterQuotedPostKeys: "pid,title,content,contentLength,author.nickname,author.avatar,author.status",
        filterPreviewCommentType: "whitelist",
        filterPreviewCommentKeys: "cid,content,contentLength,author.nickname,author.avatar,author.status",
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
    }

    if (detailType === "comments") {
      const res = await fresnsApi.comment.timelines({
        filterType: "blacklist",
        filterKeys: "hashtags,previewLikeUsers",
        filterGeotagType: "whitelist",
        filterGeotagKeys: "gtid,name,distance,unit",
        filterAuthorType: "whitelist",
        filterAuthorKeys:
          "fsid,uid,nickname,nicknameColor,avatar,decorate,verified,verifiedIcon,status,roleName,roleNameDisplay,roleIcon,roleIconDisplay,operations",
        filterPreviewCommentType: "whitelist",
        filterPreviewCommentKeys: "cid,content,contentLength,author.nickname,author.avatar,author.status",
        filterReplyToPostType: "whitelist",
        filterReplyToPostKeys: "pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name",
        filterReplyToCommentType: "whitelist",
        filterReplyToCommentKeys:
          "cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status",
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
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
