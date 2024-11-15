import * as MediaLibrary from "expo-media-library";
import { cloneDeep, throttle } from "lodash";
import { observable } from "mobx";
import { BasicStore } from "../../../../sdk/utilities";
import { navigate } from "../../../router/navigate";
import { ScreenName } from "../../../router/screen-name";
import { EApiCode } from "../../../../sdk/api";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { ToastMessage } from "../../message/toast-message";

class Data {
  showShareModal: boolean = false;
  sharePoster: string;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  props: {
    post: any;
    viewType?: "list" | "detail" | string;
  };

  onClickPostLike = throttle(async () => {
    const { post } = this.props;
    const initial = cloneDeep(post);

    if (post.interaction.likeStatus) {
      post.interaction.likeStatus = false; // 取消赞
      post.likeCount = Math.max(0, (post.likeCount || 0) - 1);
    } else {
      post.interaction.likeStatus = true; // 赞
      post.likeCount = Math.max(0, (post.likeCount || 0) + 1);

      if (post.interaction.dislikeStatus) {
        post.interaction.dislikeStatus = false; // 取消踩
        post.dislikeCount = Math.max(0, (post.dislikeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "post",
      fsid: post.pid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangePost", post);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangePost", initial);
    }
  }, 1000);

  onClickPostDislike = throttle(async () => {
    const { post } = this.props;
    const initialUser = cloneDeep(post);

    if (post.interaction.dislikeStatus) {
      post.interaction.dislikeStatus = false; // 取消踩
      post.dislikeCount = Math.max(0, (post.dislikeCount || 0) - 1);
    } else {
      post.interaction.dislikeStatus = true; // 踩
      post.dislikeCount = Math.max(0, (post.dislikeCount || 0) + 1);

      if (post.interaction.likeStatus) {
        post.interaction.likeStatus = false; // 取消赞
        post.likeCount = Math.max(0, (post.likeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "post",
      fsid: post.pid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangePost", post);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangePost", initialUser);
    }
  }, 1000);

  onClickPostFollow = throttle(async () => {
    const { post } = this.props;
    const initialUser = cloneDeep(post);

    if (post.interaction.followStatus) {
      post.interaction.followStatus = false; // 取消关注
      post.followCount = Math.max(0, (post.followCount || 0) - 1);
    } else {
      post.interaction.followStatus = true; // 关注
      post.followCount = Math.max(0, (post.followCount || 0) + 1);

      if (post.interaction.blockStatus) {
        post.interaction.blockStatus = false; // 取消屏蔽
        post.blockCount = Math.max(0, (post.blockCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "post",
      fsid: post.pid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangePost", post);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangePost", initialUser);
    }
  }, 1000);

  onClickPostBlock = throttle(async () => {
    const { post } = this.props;
    const initialUser = cloneDeep(post);

    if (post.interaction.blockStatus) {
      post.interaction.blockStatus = false; // 取消屏蔽
      post.blockCount = Math.max(0, (post.blockCount || 0) - 1);
    } else {
      post.interaction.blockStatus = true; // 屏蔽
      post.blockCount = Math.max(0, (post.blockCount || 0) + 1);

      if (post.interaction.followStatus) {
        post.interaction.followStatus = false; // 取消关注
        post.followCount = Math.max(0, (post.followCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "block",
      type: "post",
      fsid: post.pid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangePost", post);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangePost", initialUser);
    }
  }, 1000);

  onClickSharePoster = throttle(async () => {
    const { post } = this.props;
    const res = await fresnsApi.plugins.generateSharePoster({ type: "post", fsid: post.pid });
    if (res.code === EApiCode.Success) {
      this.setData({
        showShareModal: true,
        sharePoster: res.data.url,
      });
    }
  }, 1000);

  async saveSharePoster() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      ToastMessage.info({ title: "Permission to access media was denied" });
      return;
    }
    try {
      await MediaLibrary.saveToLibraryAsync(this.data.sharePoster);
      ToastMessage.success({ title: "下载成功" });
    } catch (err) {
      console.error("下载失败", err);
      ToastMessage.error({ title: "下载失败" });
    } finally {
      this.setData({ showShareModal: false });
    }
  }

  async onClickExtend(item: any) {
    const { post } = this.props;
    navigate(ScreenName.WebView, {
      title: item.name,
      url: item.appUrl,
      pid: post.pid,
      viewType: this.props.viewType,
      postMessageKey: "fresnsPostManage",
    });
  }
}

export const useStore = buildStore(() => new Store());
