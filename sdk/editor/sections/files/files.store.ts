/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store";

class Data {
  isPending: boolean = true;

  fresnsLang: any;

  images: any[] = [];
  videos: any[] = [];
  audios: any[] = [];
  documents: any[] = [];
  imageUrls: any[] = [];
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  props: {
    type: string;
    did: string;
    files: any;
  };

  init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }

    const { files } = this.props;
    const { fresnsLang } = this.appStore.data;

    this.setData({
      isPending: false,
      fresnsLang: fresnsLang,
      images: files.images,
      videos: files.videos,
      audios: files.audios,
      documents: files.documents,
      imageUrls: files.images?.map((image: { imageBigUrl: any }) => image.imageBigUrl),
    });
  }
}

export const useStore = buildStore(() => new Store());
