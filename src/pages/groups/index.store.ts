import { get, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { Interaction } from "../../mixins/interaction";
import { EApiCode } from "../../../sdk/api";
import { eventManager } from "../../../sdk/helpers/event-manager";
import { fresnsApi } from "../../../sdk/services/api";
import { parseUrlParams } from "../../../sdk/utilities/toolkit";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  viewType: string = "tree";

  requestState: any = null;
  requestQuery: any = null;

  tree: any = [];
  treeGroups: any = [];
  currentTreeGid: any = null;

  groups: any = [];

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private interaction = new Interaction();

  async init() {
    const { fresnsConfig } = this.appStore.data;
    const requestState = get(fresnsConfig, "channel_group_query_state");
    const requestQuery = parseUrlParams(get(fresnsConfig, "channel_group_query_config"));

    if (requestState === 3) {
      Object.assign(requestQuery, this.options);
    }

    this.setData({
      title: get(fresnsConfig, "channel_group_name"),
      viewType: get(fresnsConfig, "channel_group_type"),
      requestState: requestState,
      requestQuery: requestQuery,
    });

    await this.loadData();
  }

  reset() {
    this.data = new Data();
  }

  onRefresh = throttle(async () => {
    this.reset();
    this.setData({ isRefreshing: true });
    await this.init();
    this.setData({ isRefreshing: false });
  }, 5000);

  onEndReached = throttle(async () => {
    if (this.data.isReachBottom) {
      return;
    }
    await this.loadData();
  }, 5000);

  onSwitchGroup(index: number) {
    const { tree } = this.data;
    this.setData({
      treeGroups: tree[index].groups || [],
      currentTreeGid: tree[index].gid,
    });
  }

  onChangeGroup = (newGroup: any) => {
    if (this.data.viewType === "tree") {
      const newTree = JSON.parse(JSON.stringify(this.data.tree));
      newTree.forEach((item) => {
        item.groups?.forEach((group, idx) => {
          if (group.gid === newGroup.gid) {
            item.groups[idx] = newGroup;
          }
        });
      });
      this.setData({ tree: newTree });
      this.onSwitchGroup(this.data.tree.findIndex((v) => v.gid === this.data.currentTreeGid));
      return;
    }
    if (this.data.viewType === "list") {
      this.interaction.onChangeGroup(this, newGroup);
    }
  };

  addListener() {
    eventManager.on("onChangeGroup", this.onChangeGroup);
  }

  removeListener() {
    eventManager.off("onChangeGroup", this.onChangeGroup);
  }

  @computed get tipType() {
    const { groups, isReachBottom } = this.data;
    if (isReachBottom) {
      return groups.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  private async loadData() {
    this.setData({ isLoading: true });
    switch (this.data.viewType) {
      case "tree":
        const treeRes = await fresnsApi.group.tree();
        if (treeRes.code === EApiCode.Success) {
          this.setData({
            tree: treeRes.data,
            treeGroups: treeRes.data[0].groups || [],
            currentTreeGid: treeRes.data[0].gid,
          });
        }
        break;
      case "list":
        const listRes = await fresnsApi.group.list(
          Object.assign({}, this.data.requestQuery, {
            filterType: "blacklist",
            filterKeys: "archives,operations",
            page: this.data.page,
          })
        );
        if (listRes.code === EApiCode.Success) {
          const { pagination, list } = listRes.data;

          this.setData({
            groups: this.data.groups.concat(list),
            page: this.data.page + 1,
            isReachBottom: pagination.currentPage >= pagination.lastPage,
          });
        }
        break;
      default:
        break;
    }
    this.setData({ isLoading: false });
  }
}

export const useStore = buildStore(() => new Store());
