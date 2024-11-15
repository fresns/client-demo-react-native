/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { ApiRespPromise } from "../index";
import { request } from "../tool/request";

/**
 * Group Tree List
 * @param {Object} options
 */
export const tree = (options = {}): ApiRespPromise<any> => {
  return request({
    path: "/api/fresns/v1/group/tree",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Group List
 * @param {Object} options
 */
export const list = (options = {}): ApiRespPromise<any> => {
  return request({
    path: "/api/fresns/v1/group/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Group Detail
 * @param {String} gid
 * @param {Object} options
 */
export const detail = (gid, options = {}) => {
  return request({
    path: "/api/fresns/v1/group/" + gid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Group Creator
 * @param {String} gid
 * @param {Object} options
 */
export const creator = (gid, options = {}) => {
  return request({
    path: "/api/fresns/v1/group/" + gid + "/creator",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Group Admins
 * @param {String} gid
 * @param {Object} options
 */
export const admins = (gid, options = {}) => {
  return request({
    path: "/api/fresns/v1/group/" + gid + "/admins",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Group Interaction Users
 * @param {String} gid
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (gid, type, options = {}) => {
  return request({
    path: "/api/fresns/v1/group/" + gid + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};
