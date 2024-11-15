import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { ToastMessage } from "../../components/message/toast-message";
import { navigate } from "../../router/navigate";
import { ScreenName } from "../../router/screen-name";
import { EApiCode } from "../../../sdk/api";
import { fresnsLogin } from "../../../sdk/helpers/login";
import { fresnsAccount, fresnsOverview } from "../../../sdk/helpers/profiles";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  users: any[] = [];
  fresnsOverviews: any[] = [];
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const { fresnsConfig } = this.appStore.data;

    const users = await fresnsAccount("detail.users");
    const uidRes = await Promise.all(
      users.map(async (user) => {
        return fresnsOverview(null, user.uid);
      })
    );

    this.setData({
      title: get(fresnsConfig, "channel_me_users_name"),
      users: users,
      fresnsOverviews: uidRes,
    });
  }

  reset(): any {
    this.data = new Data();
  }

  async switchUser(user: any) {
    const res = await fresnsLogin.switchUser(user.uid);
    if (res.code === EApiCode.Success) {
      ToastMessage.success({ title: "登录成功" });
      navigate(ScreenName.Me);
    }
  }
}

export const useStore = buildStore(() => new Store());
