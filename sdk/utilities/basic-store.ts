/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observable, runInAction } from "mobx";
import { messageCallback } from "../../src/mixins/message-callback"; // Jevan Note: mixins

/**
 * The base store class, which is used to inherit from the single-page store.
 */
export abstract class BasicStore<T> {
  /**
   * Listened state value
   */
  @observable data!: T;

  options: any = {};

  init(...args: any): any {}

  reset(): any {}

  addListener(): any {}

  removeListener(): any {}

  /**
   * The wrapper code here is the method that the store executes in useEffect.
   */
  async handleCallbackMessage() {
    await messageCallback.handleMessage();
  }

  /**
   * Encapsulate runInAction to unify updated status values
   * @param object
   */
  setData(object: Partial<T>) {
    runInAction(() => {
      this.data = Object.assign({}, { ...this.data }, { ...object });
    });
  }
}
