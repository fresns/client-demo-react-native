/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import axios, { AxiosRequestConfig } from "axios";
import { isNil, isNumber } from "lodash";
import { ToastMessage } from "../../components/message/toast-message";
import { isLogicEmpty } from "../../utilities/toolkit";
import { getHeaders } from "./header";
import env from "../../../env";

type RequestConfig = {
  path: string;
} & AxiosRequestConfig;

export async function request(config: RequestConfig, removeEmptyData: boolean = true): Promise<any> {
  if (removeEmptyData && !isNil(config.data)) {
    // Remove empty pairs
    Object.getOwnPropertyNames(config.data).forEach((key) => {
      if (isLogicEmpty(config.data[key])) {
        delete config.data[key];
      }
    });
  }

  return new Promise(async (resolve, reject) => {
    const { path } = config;

    const res = await axios.request({
      ...config,
      url: env.apiHost + path,
      headers: {
        ...(await getHeaders()),
        ...config.headers,
      },
    });

    if (res.status !== 200) {
      reject(res);
      return;
    }

    if (isNumber(res.data.code) && res.data.code !== 0) {
      console.error("Request error: ", res.data.message);
      ToastMessage.error({ title: "Request Error", content: res.data.message });
    }

    resolve(res.data);
    return;
  });
}
