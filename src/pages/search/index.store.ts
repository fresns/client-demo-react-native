import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  searchType: string;
  searchKey: string;

  fresnsLang: any;

  inputVal: string = "";

  // 当前分页数据
  users = [];
  groups = [];
  hashtags = [];
  geotags = [];
  posts = [];
  comments = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsConfig, fresnsLang } = this.appStore.data;
    this.setData({
      title: get(fresnsConfig, "channel_search_name"),
      searchType: this.options.type || "user",
      searchKey: this.options.key || "xx",
      fresnsLang: fresnsLang,
    });
    await this.loadData();
  }

  reset(): any {
    this.data = new Data();
  }

  async switchType(type: string) {
    this.clearInput();
    this.setData({ searchType: type });
  }

  clearInput() {
    this.setData({
      inputVal: "",

      users: [],
      groups: [],
      hashtags: [],
      geotags: [],
      posts: [],
      comments: [],

      page: 1,
      isReachBottom: false,
      isRefreshing: false,
      isLoading: false,
    });
  }

  async confirmSearch() {
    this.setData({
      users: [],
      groups: [],
      hashtags: [],
      geotags: [],
      posts: [],
      comments: [],

      page: 1,
      isReachBottom: false,
      isRefreshing: false,
      isLoading: false,
    });
    await this.loadData();
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

  @computed get tipType() {
    const { posts, isReachBottom } = this.data;
    if (isReachBottom) {
      return posts.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  @computed get typeName() {
    const { fresnsConfig } = this.appStore.data;
    const { searchType } = this.data;
    if (searchType === "user") {
      return get(fresnsConfig, "user_name");
    }
    if (searchType === "group") {
      return get(fresnsConfig, "group_name");
    }
    if (searchType === "hashtag") {
      return get(fresnsConfig, "hashtag_name");
    }
    if (searchType === "geotag") {
      return get(fresnsConfig, "geotag_name");
    }
    if (searchType === "post") {
      return get(fresnsConfig, "post_name");
    }
    if (searchType === "comment") {
      return get(fresnsConfig, "comment_name");
    }
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const { searchType, searchKey } = this.data;

    switch (searchType) {
      case "user": {
        const res = await fresnsApi.search.users({
          searchKey: searchKey,
          filterType: "whitelist",
          filterKeys:
            "fsid,uid,username,url,nickname,nicknameColor,avatar,decorate,bioHtml,stats,operations,interaction",
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
        break;
      }
      case "group": {
        const res = await fresnsApi.search.groups({
          searchKey: searchKey,
          filterType: "blacklist",
          filterKeys: "archives,operations",
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
        break;
      }
      case "hashtag": {
        const res = await fresnsApi.search.hashtags({
          searchKey: searchKey,
          filterType: "whitelist",
          filterKeys:
            "htid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction",
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
        break;
      }
      case "geotag": {
        const res = await fresnsApi.search.geotags({
          searchKey: searchKey,
          filterType: "whitelist",
          filterKeys:
            "gtid,url,name,cover,description,viewCount,likeCount,dislikeCount,followCount,blockCount,postCount,postDigestCount,operations,interaction",
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
        break;
      }
      case "post": {
        const res = await fresnsApi.search.posts({
          searchKey: searchKey,
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
        });

        if (res.code === 0) {
          const { pagination, list } = res.data;

          this.setData({
            users: this.data.users.concat(list),
            page: this.data.page + 1,
            isReachBottom: pagination.currentPage >= pagination.lastPage,
          });
        }
        break;
      }
      case "comment": {
        const res = await fresnsApi.search.comments({
          searchKey: searchKey,
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
        });

        if (res.code === 0) {
          const { pagination, list } = res.data;

          this.setData({
            users: this.data.users.concat(list),
            page: this.data.page + 1,
            isReachBottom: pagination.currentPage >= pagination.lastPage,
          });
        }
        break;
      }
      default:
        return;
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
