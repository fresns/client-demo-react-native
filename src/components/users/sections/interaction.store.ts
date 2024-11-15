import { cloneDeep, throttle } from "lodash";
import { BasicStore } from "../../../../sdk/utilities";
import { EApiCode } from "../../../../sdk/api";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { ToastMessage } from "../../message/toast-message";

class Store extends BasicStore<any> {
  props: {
    user: any;
  };

  onClickUserLike = throttle(async () => {
    const { user } = this.props;
    const initialUser = cloneDeep(user);

    if (user.interaction.likeStatus) {
      user.interaction.likeStatus = false; // 取消赞
      user.stats.likerCount = Math.max(0, (user.stats.likerCount || 0) - 1);
    } else {
      user.interaction.likeStatus = true; // 赞
      user.stats.likerCount = Math.max(0, (user.stats.likerCount || 0) + 1);

      if (user.interaction.dislikeStatus) {
        user.interaction.dislikeStatus = false; // 取消踩
        user.stats.dislikerCount = Math.max(0, (user.stats.dislikerCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "user",
      fsid: user.uid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeUser", user);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeUser", initialUser);
    }
  }, 1000);

  onClickUserDislike = throttle(async () => {
    const { user } = this.props;
    const initialUser = cloneDeep(user);

    if (user.interaction.dislikeStatus) {
      user.interaction.dislikeStatus = false; // 取消踩
      user.stats.dislikerCount = Math.max(0, (user.stats.dislikerCount || 0) - 1);
    } else {
      user.interaction.dislikeStatus = true; // 踩
      user.stats.dislikerCount = Math.max(0, (user.stats.dislikerCount || 0) + 1);

      if (user.interaction.likeStatus) {
        user.interaction.likeStatus = false; // 取消赞
        user.stats.likerCount = Math.max(0, (user.stats.likerCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "user",
      fsid: user.uid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeUser", user);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeUser", initialUser);
    }
  }, 1000);

  onClickUserFollow = throttle(async () => {
    const { user } = this.props;
    const initialUser = cloneDeep(user);

    if (user.interaction.followStatus) {
      user.interaction.followStatus = false; // 取消关注
      user.stats.followerCount = Math.max(0, (user.stats.followerCount || 0) - 1);
    } else {
      user.interaction.followStatus = true; // 关注
      user.stats.followerCount = Math.max(0, (user.stats.followerCount || 0) + 1);

      if (user.interaction.blockStatus) {
        user.interaction.blockStatus = false; // 取消屏蔽
        user.stats.blockerCount = Math.max(0, (user.stats.blockerCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "user",
      fsid: user.uid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeUser", user);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeUser", initialUser);
    }
  }, 1000);

  onClickUserBlock = throttle(async () => {
    const { user } = this.props;
    const initialUser = cloneDeep(user);

    if (user.interaction.blockStatus) {
      user.interaction.blockStatus = false; // 取消屏蔽
      user.stats.blockerCount = Math.max(0, (user.stats.blockerCount || 0) - 1);
    } else {
      user.interaction.blockStatus = true; // 屏蔽
      user.stats.blockerCount = Math.max(0, (user.stats.blockerCount || 0) + 1);

      if (user.interaction.followStatus) {
        user.interaction.followStatus = false; // 取消关注
        user.stats.followerCount = Math.max(0, (user.stats.followerCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "block",
      type: "user",
      fsid: user.uid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeUser", user);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeUser", initialUser);
    }
  }, 1000);
}

export const useStore = buildStore(() => new Store());
