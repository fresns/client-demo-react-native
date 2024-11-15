import { get, isNil, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { EApiCode } from "../../../sdk/api";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  requestQuery: any;

  detailType: string = "posts";

  hashtag: any;

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
      title: get(fresnsConfig, "group_name"),
      detailType: get(fresnsConfig, "channel_group_detail_type"),
      requestQuery: this.options,
    });
    await this.loadDetail();
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

  onChangeHashtag = (newHashtag: any) => {
    this.interaction.onChangeHashtag(this, newHashtag);
  };

  onChangePost = (newPost: any) => {
    this.interaction.onChangePost(this, newPost);
  };

  onChangeComment = (newComment: any) => {
    this.interaction.onChangeComment(this, newComment);
  };

  addListener() {
    eventManager.on("onChangeHashtag", this.onChangeHashtag);
    eventManager.on("onChangePost", this.onChangePost);
    eventManager.on("onChangeComment", this.onChangeComment);
  }

  removeListener() {
    eventManager.off("onChangeHashtag", this.onChangeHashtag);
    eventManager.off("onChangePost", this.onChangePost);
    eventManager.off("onChangeComment", this.onChangeComment);
  }

  @computed get tipType() {
    const { detailType, comments, posts, isReachBottom } = this.data;
    if (isReachBottom) {
      if (detailType === "posts") {
        return posts.length > 0 ? "page" : "empty";
      }
      if (detailType === "comments") {
        return comments.length > 0 ? "page" : "empty";
      }
      return "none";
    }
    return "none";
  }

  private async loadDetail() {
    if (isNil(this.options.htid)) {
      return;
    }

    const res = await fresnsApi.hashtag.detail(this.options.htid);
    if (res.code === EApiCode.Success) {
      const newGeotag = res.data.detail;
      this.setData({
        hashtag: newGeotag,
      });

      eventManager.emit("onChangeHashtag", newGeotag);
    }
  }

  private async loadData() {
    this.setData({ isLoading: true });

    if (this.data.detailType === "posts") {
      const res = await fresnsApi.post.list(
        Object.assign(this.data.requestQuery, {
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
          filterReplyToPostKeys:
            "pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name",
          filterReplyToCommentType: "whitelist",
          filterReplyToCommentKeys:
            "cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status",
          page: this.data.page,
        })
      );

      if (res.code === 0) {
        const { pagination, list } = res.data;
        this.setData({
          posts: this.data.posts.concat(list),
          page: this.data.page + 1,
          isReachBottom: pagination.currentPage >= pagination.lastPage,
        });
      }
    }
    if (this.data.detailType === "comments") {
      const res = await fresnsApi.comment.list(
        Object.assign(this.data.requestQuery, {
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
          filterReplyToPostKeys:
            "pid,title,content,contentLength,author.nickname,author.avatar,author.status,group.name",
          filterReplyToCommentType: "whitelist",
          filterReplyToCommentKeys:
            "cid,content,contentLength,createdDatetime,author.nickname,author.avatar,author.status",
          page: this.data.page,
        })
      );

      if (res.code === 0) {
        const { pagination, list } = res.data;
        this.setData({
          comments: this.data.comments.concat(list),
          page: this.data.page + 1,
          isReachBottom: pagination.currentPage >= pagination.lastPage,
        });
      }
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
