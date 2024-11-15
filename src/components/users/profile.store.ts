import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { BasicStore } from "../../../sdk/utilities";
import { fresnsAuth } from "../../../sdk/helpers/fresns-auth";
import { buildStore } from "../../store";

class Data {
  isPending: boolean = true;

  fresnsLang: any;
  isMe: boolean = true;
  showMoreSheet: boolean = false;
  followersYouFollowEnabled: boolean = false;
  buttonIcons: any;
}

class UserProfileItemStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  init(): any {
    const { fresnsConfig, fresnsLang } = this.appStore.data;
    this.setData({
      isPending: false,
      followersYouFollowEnabled: get(fresnsConfig, "profile_followers_you_follow_enabled"),
      fresnsLang: {
        userFollowing: get(fresnsLang, "userFollowing"),
        userFollowersYouKnow: get(fresnsLang, "userFollowersYouKnow"),
        cancel: get(fresnsLang, "cancel"),
      },
    });
  }

  async handleProps(props: any) {
    const { user } = props;
    if (isNil(user)) {
      return;
    }

    const buttonIconsArr = user.operations.buttonIcons;
    if (buttonIconsArr.length > 0) {
      const moreItem = buttonIconsArr.find((item) => item.code === "more");

      this.setData({
        buttonIcons: {
          more: moreItem?.imageUrl,
          moreActive: moreItem?.imageActiveUrl,
        },
      });
    }

    this.setData({ isMe: (await fresnsAuth.uid()) === user.uid });
  }
}

export const useProfileItemStore = buildStore(() => new UserProfileItemStore());
