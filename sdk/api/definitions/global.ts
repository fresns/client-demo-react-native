/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { ApiRespPromise } from "../index";
import { request } from "../tool/request";

/**
 * Client Status
 */
export const status = (): Promise<any> => {
  return request({
    path: "/api/fresns/v1/global/status",
    method: "GET",
    params: {
      timestamp: Date.now(),
    },
  });
};

/**
 * Configs
 * @param {Object} options
 */
export const configs = (options: any = {}): ApiRespPromise<any> => {
  return request({
    path: "/api/fresns/v1/global/configs",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Language Pack
 */
export const languagePack = (): ApiRespPromise<any> => {
  return request({
    path: "/api/fresns/v1/global/language-pack",
    method: "GET",
  });
};

/**
 * Extend Channels
 */
export const channels = () => {
  return request({
    path: "/api/fresns/v1/global/channels",
    method: "GET",
  });
};

/**
 * Extend Archives
 * @param {String} type user, post, comment
 * @param {Object} options
 */
export const archives = (type, options = {}) => {
  return request({
    path: "/api/fresns/v1/global/" + type + "/archives",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Content Types
 * @param {String} type post, comment
 * @param {Object} options
 */
export const contentTypes = (type, options = {}) => {
  return request({
    path: "/api/fresns/v1/global/" + type + "/content-types",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * User Roles
 * @param {Object} options
 */
export const roles = (options = {}) => {
  return request({
    path: "/api/fresns/v1/global/roles",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Stickers
 */
export const stickers = () => {
  return request({
    path: "/api/fresns/v1/global/stickers",
    method: "GET",
  });
};
