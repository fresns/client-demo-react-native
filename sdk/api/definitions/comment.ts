/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Comment List
 * @param {Object} options
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment List by Timelines
 * @param {Object} options
 */
export const timelines = (options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/timelines",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment List by Nearby
 * @param {Object} options
 */
export const nearby = (options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/nearby",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment Detail
 * @param {String} cid
 * @param {Object} options
 */
export const detail = (cid, options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/" + cid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment Interaction Users
 * @param {String} cid
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (cid, type, options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/" + cid + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment Histories
 * @param {String} cid
 * @param {Object} options
 */
export const histories = (cid, options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/" + cid + "/histories",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Comment History Detail
 * @param {String} hcid
 * @param {Object} options
 */
export const historyDetail = (hcid, options = {}) => {
  return request({
    path: "/api/fresns/v1/comment/history/" + hcid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Delete Comment
 * @param {String} cid
 */
export const remove = (cid) => {
  return request({
    path: "/api/fresns/v1/comment/" + cid,
    method: "DELETE",
  });
};
