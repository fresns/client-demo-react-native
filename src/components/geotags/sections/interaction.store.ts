import { cloneDeep, throttle } from "lodash";
import { BasicStore } from "../../../../sdk/utilities";
import { EApiCode } from "../../../../sdk/api";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { ToastMessage } from "../../message/toast-message";

class Store extends BasicStore<any> {
  props: {
    geotag: any;
  };

  onClickGeotagLike = throttle(async () => {
    const { geotag } = this.props;
    const initial = cloneDeep(geotag);

    if (geotag.interaction.likeStatus) {
      geotag.interaction.likeStatus = false; // 取消赞
      geotag.likeCount = Math.max(0, (geotag.likeCount || 0) - 1);
    } else {
      geotag.interaction.likeStatus = true; // 赞
      geotag.likeCount = Math.max(0, (geotag.likeCount || 0) + 1);

      if (geotag.interaction.dislikeStatus) {
        geotag.interaction.dislikeStatus = false; // 取消踩
        geotag.dislikeCount = Math.max(0, (geotag.dislikeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "geotag",
      fsid: geotag.gtid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGeotag", geotag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGeotag", initial);
    }
  }, 1000);

  onClickGeotagDislike = throttle(async () => {
    const { geotag } = this.props;
    const initialUser = cloneDeep(geotag);

    if (geotag.interaction.dislikeStatus) {
      geotag.interaction.dislikeStatus = false; // 取消踩
      geotag.dislikeCount = Math.max(0, (geotag.dislikeCount || 0) - 1);
    } else {
      geotag.interaction.dislikeStatus = true; // 踩
      geotag.dislikeCount = Math.max(0, (geotag.dislikeCount || 0) + 1);

      if (geotag.interaction.likeStatus) {
        geotag.interaction.likeStatus = false; // 取消赞
        geotag.likeCount = Math.max(0, (geotag.likeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "geotag",
      fsid: geotag.gtid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGeotag", geotag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGeotag", initialUser);
    }
  }, 1000);

  onClickGeotagFollow = throttle(async () => {
    const { geotag } = this.props;
    const initialUser = cloneDeep(geotag);

    if (geotag.interaction.followStatus) {
      geotag.interaction.followStatus = false; // 取消关注
      geotag.followCount = Math.max(0, (geotag.followCount || 0) - 1);
    } else {
      geotag.interaction.followStatus = true; // 关注
      geotag.followCount = Math.max(0, (geotag.followCount || 0) + 1);

      if (geotag.interaction.blockStatus) {
        geotag.interaction.blockStatus = false; // 取消屏蔽
        geotag.blockCount = Math.max(0, (geotag.blockCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "geotag",
      fsid: geotag.gtid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGeotag", geotag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGeotag", initialUser);
    }
  }, 1000);

  onClickGeotagBlock = throttle(async () => {
    const { geotag } = this.props;
    const initialUser = cloneDeep(geotag);

    if (geotag.interaction.blockStatus) {
      geotag.interaction.blockStatus = false; // 取消屏蔽
      geotag.blockCount = Math.max(0, (geotag.blockCount || 0) - 1);
    } else {
      geotag.interaction.blockStatus = true; // 屏蔽
      geotag.blockCount = Math.max(0, (geotag.blockCount || 0) + 1);

      if (geotag.interaction.followStatus) {
        geotag.interaction.followStatus = false; // 取消关注
        geotag.followCount = Math.max(0, (geotag.followCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "block",
      type: "geotag",
      fsid: geotag.gtid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGeotag", geotag);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGeotag", initialUser);
    }
  }, 1000);
}

export const useStore = buildStore(() => new Store());
