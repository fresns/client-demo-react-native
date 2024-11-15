/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { isNil } from "lodash";
import { observable } from "mobx";
import { BasicStore } from "../../../utilities";
import { buildStore } from "../../../../src/store"; // Jevan Note: store

class Data {
  isPending: boolean = true;

  archiveAllConfigs: any[] = [];

  archivesMap: any = null;

  dialog: boolean = false;
  wrap: boolean = false;

  currentArchiveConfig: any;
  currentArchive: any;

  langImage: string = "Image";
  langVideo: string = "Video";
  langAudio: string = "Audio";
  langDocument: string = "Document";
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  props: {
    type: string;
    did: string;
    archives: any[];
    archiveGroupConfigs: any[];
  };

  init() {
    if (isNil(this.props)) {
      this.setData({ isPending: false });
      return;
    }
  }
}

export const useStore = buildStore(() => new Store());
