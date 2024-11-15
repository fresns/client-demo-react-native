import { cloneDeep, throttle } from "lodash";
import { BasicStore } from "../../../../sdk/utilities";
import { EApiCode } from "../../../../sdk/api";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { ToastMessage } from "../../message/toast-message";

class Store extends BasicStore<any> {
  props: {
    hashtag: any;
  };

  onClickHashtagLike = throttle(async () => {
    const { hashtag } = this.props;
    const initial = cloneDeep(hashtag);

    if (hashtag.interaction.likeStatus) {
      hashtag.interaction.likeStatus = false; // 取消赞
      hashtag.likeCount = Math.max(0, (hashtag.likeCount || 0) - 1);
    } else {
      hashtag.interaction.likeStatus = true; // 赞
      hashtag.likeCount = Math.max(0, (hashtag.likeCount || 0) + 1);

      if (hashtag.interaction.dislikeStatus) {
        hashtag.interaction.dislikeStatus = false; // 取消踩
        hashtag.dislikeCount = Math.max(0, (hashtag.dislikeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "hashtag",
      fsid: hashtag.htid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeHashtag", hashtag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeHashtag", initial);
    }
  }, 1000);

  onClickHashtagDislike = throttle(async () => {
    const { hashtag } = this.props;
    const initial = cloneDeep(hashtag);

    if (hashtag.interaction.dislikeStatus) {
      hashtag.interaction.dislikeStatus = false; // 取消踩
      hashtag.dislikeCount = Math.max(0, (hashtag.dislikeCount || 0) - 1);
    } else {
      hashtag.interaction.dislikeStatus = true; // 踩
      hashtag.dislikeCount = Math.max(0, (hashtag.dislikeCount || 0) + 1);

      if (hashtag.interaction.likeStatus) {
        hashtag.interaction.likeStatus = false; // 取消赞
        hashtag.likeCount = Math.max(0, (hashtag.likeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "hashtag",
      fsid: hashtag.htid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeHashtag", hashtag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeHashtag", initial);
    }
  }, 1000);

  onClickHashtagFollow = throttle(async () => {
    const { hashtag } = this.props;
    const initial = cloneDeep(hashtag);

    if (hashtag.interaction.followStatus) {
      hashtag.interaction.followStatus = false; // 取消关注
      hashtag.followCount = Math.max(0, (hashtag.followCount || 0) - 1);
    } else {
      hashtag.interaction.followStatus = true; // 关注
      hashtag.followCount = Math.max(0, (hashtag.followCount || 0) + 1);

      if (hashtag.interaction.blockStatus) {
        hashtag.interaction.blockStatus = false; // 取消屏蔽
        hashtag.blockCount = Math.max(0, (hashtag.blockCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "hashtag",
      fsid: hashtag.htid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeHashtag", hashtag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeHashtag", initial);
    }
  }, 1000);

  onClickHashtagBlock = throttle(async () => {
    const { hashtag } = this.props;
    const initial = cloneDeep(hashtag);

    if (hashtag.interaction.blockStatus) {
      hashtag.interaction.blockStatus = false; // 取消屏蔽
      hashtag.blockCount = Math.max(0, (hashtag.blockCount || 0) - 1);
    } else {
      hashtag.interaction.blockStatus = true; // 屏蔽
      hashtag.blockCount = Math.max(0, (hashtag.blockCount || 0) + 1);

      if (hashtag.interaction.followStatus) {
        hashtag.interaction.followStatus = false; // 取消关注
        hashtag.followCount = Math.max(0, (hashtag.followCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "block",
      type: "hashtag",
      fsid: hashtag.htid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeHashtag", hashtag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeHashtag", initial);
    }
  }, 1000);
}

export const useStore = buildStore(() => new Store());
