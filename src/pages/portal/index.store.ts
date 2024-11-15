import { observable } from "mobx";
import { fresnsConfig } from "../../../sdk/helpers/configs";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string | undefined;
  content: string | undefined;
}

class PortalStore extends BasicStore<Data> {
  @observable data = new Data();

  async init() {
    this.setData({
      title: await fresnsConfig("channel_portal_name", "门户xxx"),
      content: await fresnsConfig("portal_7", "暂无内容"),
    });
  }
}

export const usePortalStore = buildStore(() => new PortalStore());
