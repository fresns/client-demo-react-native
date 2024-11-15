import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { ToastMessage } from "../../components/message/toast-message";
import { EApiCode } from "../../../sdk/api";
import { Cache } from "../../../sdk/helpers/cache";
import { fresnsAccount, fresnsOverview, fresnsUser } from "../../../sdk/helpers/profiles";
import { fresnsApi } from "../../../sdk/services/api";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;

  fresnsConfig: any;
  fresnsLang: any;

  fresnsAccount: any;
  fresnsUser: any;
  fresnsOverview: any;

  birthdayDisplayOptions: string[] = [];
  genderOptions: string[] = [];
  genderPronounOptions: string[] = [];
  genderPronouns: string[] = [];
  policyOptions: string[] = [];
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsConfig, fresnsLang } = this.appStore.data;
    this.setData({
      title: get(fresnsConfig, "channel_me_settings_name"),
      fresnsConfig,
      fresnsLang,
      fresnsAccount: await fresnsAccount("detail"),
      fresnsUser: await fresnsUser("detail"),
      fresnsOverview: await fresnsOverview(),
      birthdayDisplayOptions: [
        get(fresnsLang, "settingBirthdayDisplayType1"),
        get(fresnsLang, "settingBirthdayDisplayType2"),
        get(fresnsLang, "settingBirthdayDisplayType3"),
        get(fresnsLang, "settingBirthdayDisplayType4"),
      ],
      genderOptions: [
        get(fresnsLang, "settingGenderNull"),
        get(fresnsLang, "settingGenderMale"),
        get(fresnsLang, "settingGenderFemale"),
        get(fresnsLang, "settingGenderCustom"),
      ],
      genderPronounOptions: [
        get(fresnsLang, "settingGenderPronounOptionShe"),
        get(fresnsLang, "settingGenderPronounOptionHe"),
        get(fresnsLang, "settingGenderPronounOptionThey"),
      ],
      genderPronouns: [get(fresnsLang, "she"), get(fresnsLang, "he"), get(fresnsLang, "they")],
      policyOptions: [
        get(fresnsLang, "optionEveryone"),
        get(fresnsLang, "optionPeopleYouFollow"),
        get(fresnsLang, "optionPeopleYouFollowOrVerified"),
        get(fresnsLang, "optionNoOneIsAllowed"),
      ],
    });
  }

  reset(): any {
    this.data = new Data();
  }

  async reloadFresnsUser() {
    await Cache.delete("fresnsUserData");
    this.setData({
      fresnsUser: await fresnsUser("detail"),
    });
  }

  async modifyAvatar(uri: string) {
    const uid = this.data.fresnsUser.uid;
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();

    const formData = new FormData();
    formData.append("usageType", "userAvatar");
    formData.append("usageFsid", uid);
    formData.append("type", "image");
    formData.append("file", theBlob);
    const res = await fresnsApi.common.fileUpload(formData);

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "头像切换成功" });
    }
  }

  async modifyBirthdayDisplayType(value: number) {
    const res = await fresnsApi.user.updateProfile({
      birthdayDisplayType: value,
    });

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "日期显示切换成功" });
    }
  }

  async modifyGender(value: number) {
    const res = await fresnsApi.user.updateProfile({
      gender: value,
    });

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "性别切换成功" });
    }
  }

  async modifyGenderPronoun(value: number) {
    const res = await fresnsApi.user.updateProfile({
      genderPronoun: value,
    });

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "性别：自定义代称切换成功" });
    }
  }

  async modifyConversationPolicy(value: number) {
    const res = await fresnsApi.user.updateSetting({
      conversationPolicy: value,
    });

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "互动对话切换成功" });
    }
  }

  async modifyCommentPolicy(value: number) {
    const res = await fresnsApi.user.updateSetting({
      commentPolicy: value,
    });

    if (res.code === EApiCode.Success) {
      await this.reloadFresnsUser();
      ToastMessage.success({ title: "互动评论切换成功" });
    }
  }
}

export const useStore = buildStore(() => new Store());
