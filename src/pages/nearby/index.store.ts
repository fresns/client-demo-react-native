import * as Location from "expo-location";
import { get, isNil, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { ToastMessage } from "../../components/message/toast-message";
import { Interaction } from "../../mixins/interaction";
import { EApiCode } from "../../../sdk/api";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  detailType: string = "posts";

  name: string;
  select: string;

  mapId: any;
  latitude: any;
  longitude: any;

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
      title: get(fresnsConfig, "channel_nearby_name"),
      detailType: get(fresnsConfig, "channel_nearby_type"),
      name: get(fresnsConfig, "location"),
      select: get(fresnsConfig, "select"),
    });
    await this.requestLocationPermission();
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
    const { detailType, posts, comments, isReachBottom } = this.data;
    if (isReachBottom) {
      if (detailType === "posts") {
        return posts.length > 0 ? "page" : "empty";
      }
      if (detailType === "comments") {
        return comments.length > 0 ? "page" : "empty";
      }
    }
    return "none";
  }

  private async loadData() {
    const { detailType, mapId, longitude, latitude } = this.data;
    if (isNil(longitude) || isNil(latitude)) {
      return;
    }

    this.setData({ isLoading: true });

    if (detailType === "posts") {
      const res = await fresnsApi.post.nearby({
        mapId: mapId,
        mapLat: latitude,
        mapLng: longitude,
        unit: "km",
        length: 10,
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

      if (res.code === EApiCode.Success) {
        const { pagination, list } = res.data;
        this.setData({
          posts: this.data.posts.concat(list),
          page: this.data.page + 1,
          isReachBottom: pagination.currentPage >= pagination.lastPage,
        });
      }
    }

    if (detailType === "comments") {
      const res = await fresnsApi.comment.nearby({
        mapId: mapId,
        mapLat: latitude,
        mapLng: longitude,
        unit: "km",
        length: 10,
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
      if (res.code === EApiCode.Success) {
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

  private async requestLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      ToastMessage.info({ title: "Permission to access location was denied" });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(`location res: ${location}`);

    this.setData({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
  }
}

export const useStore = buildStore(() => new Store());
