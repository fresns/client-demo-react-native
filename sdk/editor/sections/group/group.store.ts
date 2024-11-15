/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store"; // Jevan Note: store
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store"; // Jevan Note: store
import { EApiCode } from "../../../api";
import { fresnsEditor } from "../../../helpers/configs";
import { fresnsApi } from "../../../services/api";
import { useEditorStore } from "../../editor.store";

class Data {
  isPending: boolean = true;

  groupName: string;
  groupRequired: boolean = false;

  currentGroupCover: string;
  currentGroupName: string;

  selectDialog: boolean = false;

  fresnsLang: any;

  topGroups: any[] = [];
  // Stores all loaded groups and does not request the interface when reloaded
  allGroups: any = {};
  // Store all parent group information for easy cascade access
  allParentInfo: any = {};

  currentParentInfo: any;
  currentGroups: any[] = [];

  loadingStatus: boolean = false;
  loadingTipType: string = "none";
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  props: {
    type: string;
    did: string;
    group: any;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    const { type, group } = this.props;
    const { fresnsConfig, fresnsLang } = this.appStore.data;

    const topGroups = await this.getTopGroups();

    this.setData({
      isPending: false,
      groupName: get(fresnsConfig, "group_name"),
      groupRequired: fresnsEditor[type]("editor.group.required"),
      currentGroupCover: group?.cover,
      currentGroupName: group ? group.name : get(fresnsLang, "editorNoSelectGroup"),
      fresnsLang,
      topGroups: topGroups,
      currentGroups: topGroups,
    });
  }

  async onClickNoGroup() {
    const { fresnsLang } = this.appStore.data;
    const { type, did } = this.props;

    await fresnsApi.editor.draftUpdate(type, did, { gid: null });
    this.setData({
      currentGroupCover: null,
      currentGroupName: get(fresnsLang, "editorNoGroup"),
    });
    await this.editorStore.eventGroupChange({ gid: null });
    this.setData({ selectDialog: false });
  }

  onClickGoBack(gid: string) {
    const { topGroups, allGroups, allParentInfo } = this.data;
    const currentParentInfo = allParentInfo[gid] || null;

    let currentGroups = topGroups;
    if (currentParentInfo.gid) {
      currentGroups = allGroups[currentParentInfo.gid].list || [];
    }

    this.setData({
      currentGroups: currentGroups,
      currentParentInfo: currentParentInfo,
    });
  }

  async loadSubGroups(group: any) {
    const { gid, name, subgroupCount, parentGid, parentName } = group;
    if (subgroupCount === 0) {
      return;
    }

    const { allGroups, allParentInfo } = this.data;

    const currentParentInfo = {
      gid: gid,
      name: name,
      subgroupCount: subgroupCount,
    };
    const groupParentInfo = {
      gid: parentGid,
      name: parentName,
    };

    const currentGroups = allGroups[gid] || null;
    const checkParentInfo = allParentInfo[gid] || null;

    if (!checkParentInfo) {
      allParentInfo[gid] = groupParentInfo;
    }

    this.setData({
      allParentInfo: allParentInfo,
      currentParentInfo: currentParentInfo,
    });

    if (currentGroups) {
      this.setData({
        currentGroups: currentGroups.list,
      });

      return;
    }

    await this.loadGroups(gid);
  }

  async selectGroup(group: any) {
    const { gid, name, cover } = group;
    const { type, did } = this.props;

    await fresnsApi.editor.draftUpdate(type, did, { gid: gid });
    this.setData({
      currentGroupCover: cover,
      currentGroupName: name,
    });

    await this.editorStore.eventGroupChange({ gid: gid });
    this.setData({ selectDialog: false });
  }

  private async getTopGroups() {
    const res = await fresnsApi.group.list({
      topGroups: 1,
      filterType: "whitelist",
      filterKeys: "gid,name,cover,parentInfo,subgroupCount,publishRule",
    });

    if (res.code == EApiCode.Success) {
      return res.data.list;
    }

    return [];
  }

  private async loadGroups(gid: string) {
    const { allGroups } = this.data;
    const currentGroups = allGroups[gid] || {};
    const currentList = currentGroups.list || [];
    const currentPage = currentGroups.paeg || 1;
    const isReachBottom = currentGroups.isReachBottom || false;

    if (isReachBottom) {
      return;
    }

    this.setData({ loadingStatus: true });
    const res = await fresnsApi.group.list({
      gid: gid,
      filterType: "whitelist",
      filterKeys: "gid,name,cover,parentInfo,subgroupCount,publishRule",
      page: currentPage,
    });
    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      const isReachBottom = pagination.currentPage === pagination.lastPage;
      const newGroups = currentList.concat(list);

      let tipType = "none";
      if (isReachBottom && currentPage > 1) {
        tipType = newGroups.length > 0 ? "page" : "empty";
      }

      currentGroups.isReachBottom = isReachBottom;
      currentGroups.list = newGroups;
      currentGroups.page = currentPage + 1;
      currentGroups.tipType = tipType;

      allGroups[gid] = currentGroups;

      this.setData({
        allGroups: allGroups,
        currentGroups: newGroups,
        loadingTipType: tipType,
      });
    }
    this.setData({ loadingStatus: false });
  }
}

export const useStore = buildStore(() => new Store());
