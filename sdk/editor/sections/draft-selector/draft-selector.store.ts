/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { cloneDeep, get, isNil, throttle } from "lodash";
import { computed, observable } from "mobx";
import { useAppStore } from "../../../../App.store"; // Jevan Note: store
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store"; // Jevan Note: store
import { EApiCode } from "../../../api";
import { fresnsApi } from "../../../services/api";
import { isLogicEmpty } from "../../../utilities/toolkit";
import { useEditorStore } from "../../editor.store";

class Data {
  isPending: boolean = true;

  drafts: any[] = [];

  fresnsLang: any;

  page: number = 1;
  isReachBottom: boolean = false;
  isRefreshing: boolean = false;
  isLoading: boolean = false;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;
  private editorStore = useEditorStore().store;

  props: {
    type: string;
    options: any;
    did?: string;
    fsid?: string;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    const { type, did, fsid } = this.props;

    // Unspecified draft, unspecified content
    if (isNil(did) && isNil(fsid)) {
      // Comment: create drafts directly and go to editing
      if (type === "comment") {
        await this.createDraft();
      }

      // Post: need to list drafts to provide options
      if (type === "post") {
        await this.loadPostDrafts();
        if (this.data.drafts.length === 0) {
          await this.createDraft();
        } else {
          const { fresnsLang } = this.appStore.data;
          this.setData({
            fresnsLang: {
              modifierOr: get(fresnsLang, "modifierOr"),
              selectDraft: get(fresnsLang, "editorDraftSelect"),
              createDraft: get(fresnsLang, "editorDraftCreate"),
            },
          });
        }
      }
    }

    // Designated drafts available
    if (!isNil(did)) {
      await this.enterEditingDraft(did);
    }

    // With specified editorial content
    if (!isNil(fsid)) {
      const res = await fresnsApi.editor.edit(type, fsid);
      if (res.code === EApiCode.Success) {
        this.editorStore.enterEditingMode(res.data);
      }
    }

    this.setData({ isPending: false });
  }

  reset(): any {
    this.data = new Data();
  }

  onEndReached = throttle(async () => {
    if (this.data.isReachBottom || this.data.isLoading) {
      return;
    }

    await this.loadPostDrafts();
  }, 1500);

  @computed get tipType() {
    const { drafts, isReachBottom } = this.data;
    if (isReachBottom) {
      return drafts.length > 0 ? "page" : "empty";
    }
    return "none";
  }

  async onSelectDraft(draft: any) {
    await this.enterEditingDraft(draft.did);
  }

  /**
   * Load draft list, need to get details before editing
   */
  private async loadPostDrafts() {
    this.setData({ isLoading: true });

    const res = await fresnsApi.editor.draftList(this.props.type, {
      page: this.data.page,
    });

    if (res.code === EApiCode.Success) {
      const { pagination, list } = res.data;
      this.setData({
        drafts: this.data.drafts.concat(list),
        page: this.data.page + 1,
        isReachBottom: pagination.currentPage >= pagination.lastPage,
      });
    }

    this.setData({ isLoading: false });
  }

  /**
   * Automatically creates and selects the draft
   */
  async createDraft() {
    const { type, options } = this.props;
    const draftRes = await fresnsApi.editor.draftCreate(type, {
      commentPid: options.commentPid,
      commentCid: options.commentCid,
      quotePid: options.quotePid,
      gid: options.gid,
      title: options.title,
      content: options.content,
      isMarkdown: options.isMarkdown,
      isAnonymous: options.isAnonymous,
      commentPolicy: options.commentPolicy,
      commentPrivate: options.commentPrivate,
      gtid: options.gtid,
      locationInfo: options.locationInfo,
      archives: options.archives,
      extends: options.extends,
    });

    // Draft created successfully
    if (draftRes.code === 0) {
      await this.enterEditingDraft(draftRes.data.detail.did);
    }
  }

  async enterEditingDraft(did: string) {
    const { type } = this.props;
    const options = cloneDeep(this.props.options);

    const res = await fresnsApi.editor.draftDetail(type, did);

    if (res.code === EApiCode.Success) {
      options.content = null;
      Object.getOwnPropertyNames(options).forEach((key) => {
        if (isLogicEmpty(options[key])) {
          delete options[key];
        }
      });

      let draftData = res.data;
      if (!isLogicEmpty(options)) {
        await fresnsApi.editor.draftUpdate(type, did, options);
        const newDetailRes = await fresnsApi.editor.draftDetail(type, did);
        if (newDetailRes.code === EApiCode.Success) {
          draftData = newDetailRes.data;
        }
      }

      // Select the draft and enter edit mode
      this.editorStore.enterEditingMode(draftData);
    }
  }
}

export const useStore = buildStore(() => new Store());
