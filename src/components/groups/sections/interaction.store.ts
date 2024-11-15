import { throttle } from "lodash";
import { BasicStore } from "../../../../sdk/utilities";
import { EApiCode } from "../../../../sdk/api";
import { eventManager } from "../../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../../sdk/services/api";
import { buildStore } from "../../../store";
import { ToastMessage } from "../../message/toast-message";

class Store extends BasicStore<any> {
  props: any;

  // 赞
  onClickGroupLike = throttle(async () => {
    const { group } = this.props;
    const initial = JSON.parse(JSON.stringify(group)); // 拷贝一个小组初始数据

    if (group.interaction.likeStatus) {
      group.interaction.likeStatus = false; // 取消赞
      group.likeCount = Math.max(0, (group.likeCount || 0) - 1);
    } else {
      group.interaction.likeStatus = true; // 赞
      group.likeCount = Math.max(0, (group.likeCount || 0) + 1);

      if (group.interaction.dislikeStatus) {
        group.interaction.dislikeStatus = false; // 取消踩
        group.dislikeCount = Math.max(0, (group.dislikeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "like",
      type: "group",
      fsid: group.gid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGroup", group);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGroup", initial);
    }
  }, 1000);

  // 踩
  onClickGroupDislike = throttle(async () => {
    const { group } = this.props;
    const initial = JSON.parse(JSON.stringify(group)); // 拷贝一个小组初始数据

    if (group.interaction.dislikeStatus) {
      group.interaction.dislikeStatus = false; // 取消踩
      group.dislikeCount = Math.max(0, (group.dislikeCount || 0) - 1);
    } else {
      group.interaction.dislikeStatus = true; // 踩
      group.dislikeCount = Math.max(0, (group.dislikeCount || 0) + 1);

      if (group.interaction.likeStatus) {
        group.interaction.likeStatus = false; // 取消赞
        group.likeCount = Math.max(0, (group.likeCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "dislike",
      type: "group",
      fsid: group.gid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGroup", group);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGroup", initial);
    }
  }, 1000);

  // 关注
  onClickGroupFollow = throttle(async () => {
    const { group } = this.props;
    const initial = JSON.parse(JSON.stringify(group)); // 拷贝一个小组初始数据

    if (group.interaction.followStatus) {
      group.interaction.followStatus = false; // 取消关注
      group.followCount = Math.max(0, (group.followCount || 0) - 1);
    } else {
      group.interaction.followStatus = true; // 关注
      group.followCount = Math.max(0, (group.followCount || 0) + 1);

      if (group.interaction.blockStatus) {
        group.interaction.blockStatus = false; // 取消屏蔽
        group.blockCount = Math.max(0, (group.blockCount || 0) - 1);
      }
    }

    const res = await fresnsApi.user.mark({
      markType: "follow",
      type: "group",
      fsid: group.gid,
    });

    if (res.code === EApiCode.Success) {
      eventManager.emit("onChangeGroup", group);
    } else {
      ToastMessage.error({ title: res.message });
      eventManager.emit("onChangeGroup", initial);
    }
  }, 1000);

  // 屏蔽
  onClickGroupBlock = throttle(async () => {
    const { group } = this.props;
    const initial = JSON.parse(JSON.stringify(group)); // 拷贝一个小组初始数据

    // 取消屏蔽
    if (group.interaction.blockStatus) {
      group.interaction.blockStatus = false; // 取消屏蔽
      group.blockCount = Math.max(0, (group.blockCount || 0) - 1);

      const res = await fresnsApi.user.mark({
        markType: "block",
        type: "group",
        fsid: group.gid,
      });

      if (res.code === EApiCode.Success) {
        eventManager.emit("onChangeGroup", group);
      } else {
        ToastMessage.error({ title: res.message });
        eventManager.emit("onChangeGroup", initial);
      }
    } else {
      // 屏蔽操作，二次确认
      group.interaction.blockStatus = true; // 屏蔽
      group.blockCount = Math.max(0, (group.blockCount || 0) + 1);

      if (group.interaction.followStatus) {
        group.interaction.followStatus = false; // 取消关注
        group.followCount = Math.max(0, (group.followCount || 0) - 1);
      }

      const res = await fresnsApi.user.mark({
        markType: "block",
        type: "group",
        fsid: group.gid,
      });

      if (res.code === EApiCode.Success) {
        eventManager.emit("onChangeGroup", group);
      } else {
        ToastMessage.error({ title: res.message });
        eventManager.emit("onChangeGroup", initial);
      }
    }
  }, 1000);
}

export const useStore = buildStore<Store>(() => new Store());
