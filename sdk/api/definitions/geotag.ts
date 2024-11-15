/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Geotag List
 * @param {Object} options
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/geotag/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Geotag Detail
 * @param {String} gtid
 * @param {Object} options
 */
export const detail = (gtid, options = {}) => {
  return request({
    path: "/api/fresns/v1/geotag/" + gtid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Geotag Interaction Users
 * @param {String} gtid
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (gtid, type, options = {}) => {
  return request({
    path: "/api/fresns/v1/geotag/" + gtid + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};
