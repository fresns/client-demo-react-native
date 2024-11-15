import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { EApiCode } from "../../../sdk/api";
import { fresnsUser } from "../../../sdk/helpers/profiles";
import { fresnsApi } from "../../../sdk/services/api";
import { isLogicEmpty } from "../../../sdk/utilities/toolkit";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  id: any;

  records: any[] = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  async init() {
    const id = this.options.id;
    const { fresnsConfig } = this.appStore.data;

    let title = get(fresnsConfig, "channel_me_extcredits_name");
    if (!isLogicEmpty(id)) {
      const titleKey = `extcredits${id}Name`;
      title = await fresnsUser(`detail.stats.${titleKey}`);
    }

    this.setData({
      title: title,
      id: id,
    });
    await this.loadData();
  }

  reset(): any {
    this.data = new Data();
  }

  onRefresh = throttle(async () => {
    this.reset();
    this.setData({ isRefreshing: true });
    await this.init();
    this.setData({ isRefreshing: false });
  }, 5000);

  onEndReached = throttle(async () => {
    if (this.data.isReachBottom || this.data.isLoading) {
      return;
    }

    await this.loadData();
  }, 1500);

  @computed get tipType() {
    const { records, isReachBottom } = this.data;
    if (isReachBottom) {
      return records.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.user.extcreditsRecords({
      extcreditsId: this.data.id,
      page: this.data.page,
    });

    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      this.setData({
        records: this.data.records.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
