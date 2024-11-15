/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Hashtag List
 * @param {Object} options
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/hashtag/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Hashtag Detail
 * @param {String} htid
 * @param {Object} options
 */
export const detail = (htid, options = {}) => {
  return request({
    path: "/api/fresns/v1/hashtag/" + htid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Hashtag Interaction Users
 * @param {String} htid
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (htid, type, options = {}) => {
  return request({
    path: "/api/fresns/v1/hashtag/" + htid + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};
