/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store";
import { EApiCode } from "../../../api";
import { fresnsApi } from "../../../services/api";

class Data {
  isPending: boolean = true;

  quotedPost: any;
  newContent: string = "";
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  props: {
    type: string;
    did: string;
    quotedPid: string;
  };

  async init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    await this.loadQuotedPost();
  }

  async deleteQuotedPost() {
    const { type, did } = this.props;
    const res = await fresnsApi.editor.draftUpdate(type, did, { quotedPid: "" });
    if (res.code === EApiCode.Success) {
      this.setData({
        quotedPost: undefined,
        newContent: "",
      });
    }
  }

  private async loadQuotedPost() {
    const { quotedPid } = this.props;
    const res = await fresnsApi.post.detail(quotedPid, {
      filterType: "whitelist",
      filterKeys: "pid,title,content,isAnonymous,author,group",
      filterGroupType: "whitelist",
      filterGroupKeys: "gid,name",
      filterAuthorType: "whitelist",
      filterAuthorKeys: "avatar,nickname,status",
    });

    if (res.code === EApiCode.Success) {
      const { fresnsLang } = this.appStore.data;
      const post = res.data.detail;
      let nickname = post.author.nickname;
      if (!post.author.status) {
        nickname = get(fresnsLang, "userDeactivate");
      }
      if (post.isAnonymous) {
        nickname = get(fresnsLang, "contentAuthorAnonymous");
      }
      const summaries = post.title || post.content;
      const newContent = nickname + ": " + summaries;

      this.setData({
        isPending: false,
        quotedPost: post,
        newContent: newContent,
      });
    }
  }
}

export const useStore = buildStore(() => new Store());
