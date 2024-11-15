import { useRoute } from "@react-navigation/native";
import { isNil } from "lodash";
import { useEffect, useRef } from "react";
import { BasicStore } from "../../sdk/utilities";

const StoreProvider: { [key: string]: any } = {};

export type UseStoreResult<T> = {
  store: T;
  initAndResetStore: () => void;
  initAndUnloadStore: () => void;
  addAndRemoveListener: () => void;
};

export type UseStoreOnceResult<T> = {
  store: T;
  initAndResetStore: () => void;
  addAndRemoveListener: () => void;
};

export function buildStoreGlobal<T extends BasicStore<any>>(initial: () => T, key: string): () => UseStoreResult<T> {
  StoreProvider[key] = initial();

  return (): UseStoreResult<T> => {
    if (isNil(StoreProvider[key])) {
      StoreProvider[key] = initial();
    }

    const initAndResetStore = () => {
      const route = useRoute<any>();
      useEffect(() => {
        StoreProvider[key]?.init(route?.params || {});
        StoreProvider[key]?.handleCallbackMessage();
        return () => StoreProvider[key]?.reset();
      }, []);
    };

    const initAndUnloadStore = () => {
      const route = useRoute<any>();
      useEffect(() => {
        StoreProvider[key]?.init(route?.params || {});
        StoreProvider[key]?.handleCallbackMessage();

        return () => {
          StoreProvider[key]?.reset();
          StoreProvider[key] = null;
          delete StoreProvider[key];
        };
      }, []);
    };

    const addAndRemoveListener = () => {
      useEffect(() => {
        StoreProvider[key]?.addListener();

        return () => {
          StoreProvider[key]?.removeListener();
        };
      }, []);
    };

    return { store: StoreProvider[key] as T, initAndResetStore, initAndUnloadStore, addAndRemoveListener };
  };
}

export function buildStore<T extends BasicStore<any>>(initial: () => T): () => UseStoreOnceResult<T> {
  return (): UseStoreOnceResult<T> => {
    const storeRef = useRef(initial());

    const initAndResetStore = () => {
      const route = useRoute<any>();

      useEffect(() => {
        if (storeRef.current) {
          storeRef.current.options = route?.params || {};
        }
        storeRef.current?.init(storeRef.current?.options);
        storeRef.current?.handleCallbackMessage();
        return () => storeRef.current?.reset();
      }, []);
    };

    const addAndRemoveListener = () => {
      useEffect(() => {
        storeRef.current?.addListener();

        return () => {
          storeRef.current?.removeListener();
        };
      }, []);
    };

    return { store: storeRef.current as T, initAndResetStore, addAndRemoveListener };
  };
}
