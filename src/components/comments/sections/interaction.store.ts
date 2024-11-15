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
    comment: any;
    viewType?: "list" | "detail" | string;
  };

  onClickCommentLike = throttle(async () => {
    const { comment } = this.props;
    const initial = cloneDeep(comment);

    if (comment.interaction.likeStatus) {
      comment.interaction.likeStatus = false; // 取消赞
      comment.likeCount = Math.max(0, (comment.likeCount || 0) - 1);
    } else {
      comment.interaction.likeStatus = true; // 赞
      comment.likeCount = Math.max(0, (comment.likeCount || 0) + 1);

      if (comment.interaction.dislikeStatus) {
        comment.interaction.dislikeStatus = false; // 取消踩
        comment.dislikeCount = Math.max(0, (comment.dislikeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "comment",
      fsid: comment.cid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeComment", comment);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeComment", initial);
    }
  }, 1000);

  onClickCommentDislike = throttle(async () => {
    const { comment } = this.props;
    const initialUser = cloneDeep(comment);

    if (comment.interaction.dislikeStatus) {
      comment.interaction.dislikeStatus = false; // 取消踩
      comment.dislikeCount = Math.max(0, (comment.dislikeCount || 0) - 1);
    } else {
      comment.interaction.dislikeStatus = true; // 踩
      comment.dislikeCount = Math.max(0, (comment.dislikeCount || 0) + 1);

      if (comment.interaction.likeStatus) {
        comment.interaction.likeStatus = false; // 取消赞
        comment.likeCount = Math.max(0, (comment.likeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "comment",
      fsid: comment.cid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeComment", comment);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeComment", initialUser);
    }
  }, 1000);

  onClickCommentFollow = throttle(async () => {
    const { comment } = this.props;
    const initialUser = cloneDeep(comment);

    if (comment.interaction.followStatus) {
      comment.interaction.followStatus = false; // 取消关注
      comment.followCount = Math.max(0, (comment.followCount || 0) - 1);
    } else {
      comment.interaction.followStatus = true; // 关注
      comment.followCount = Math.max(0, (comment.followCount || 0) + 1);

      if (comment.interaction.blockStatus) {
        comment.interaction.blockStatus = false; // 取消屏蔽
        comment.blockCount = Math.max(0, (comment.blockCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "comment",
      fsid: comment.cid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeComment", comment);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeComment", initialUser);
    }
  }, 1000);

  onClickCommentBlock = throttle(async () => {
    const { comment } = this.props;
    const initialUser = cloneDeep(comment);

    if (comment.interaction.blockStatus) {
      comment.interaction.blockStatus = false; // 取消屏蔽
      comment.blockCount = Math.max(0, (comment.blockCount || 0) - 1);
    } else {
      comment.interaction.blockStatus = true; // 屏蔽
      comment.blockCount = Math.max(0, (comment.blockCount || 0) + 1);

      if (comment.interaction.followStatus) {
        comment.interaction.followStatus = false; // 取消关注
        comment.followCount = Math.max(0, (comment.followCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "block",
      type: "comment",
      fsid: comment.cid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeComment", comment);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeComment", initialUser);
    }
  }, 1000);

  onClickSharePoster = throttle(async () => {
    const { comment } = this.props;
    const res = await fresnsApi.plugins.generateSharePoster({ type: "comment", fsid: comment.cid });
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
    const { comment } = this.props;
    navigate(ScreenName.WebView, {
      title: item.name,
      url: item.appUrl,
      pid: comment.cid,
      viewType: this.props.viewType,
      postMessageKey: "fresnsCommentManage",
    });
  }
}

export const useStore = buildStore(() => new Store());
