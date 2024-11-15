/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Post List
 * @param {Object} options
 */
export const list = (options) => {
  return request({
    path: "/api/fresns/v1/post/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post List by Timelines
 * @param {Object} options
 */
export const timelines = (options) => {
  return request({
    path: "/api/fresns/v1/post/timelines",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post List by Nearby
 * @param {Object} options
 */
export const nearby = (options) => {
  return request({
    path: "/api/fresns/v1/post/nearby",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post Detail
 * @param {String} pid
 * @param {Object} options
 */
export const detail = (pid, options = {}) => {
  return request({
    path: "/api/fresns/v1/post/" + pid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post Interaction Users
 * @param {String} pid
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (pid, type, options) => {
  return request({
    path: "/api/fresns/v1/post/" + pid + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post Associated Users
 * @param {String} pid
 * @param {Object} options
 */
export const users = (pid, options) => {
  return request({
    path: "/api/fresns/v1/post/" + pid + "/users",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post Quote It List
 * @param {String} pid
 * @param {Object} options
 */
export const quotes = (pid, options) => {
  return request({
    path: "/api/fresns/v1/post/" + pid + "/quotes",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post Histories
 * @param {String} pid
 * @param {Object} options
 */
export const histories = (pid, options) => {
  return request({
    path: "/api/fresns/v1/post/" + pid + "/histories",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Post History Detail
 * @param {String} hpid
 * @param {Object} options
 */
export const historyDetail = (hpid, options) => {
  return request({
    path: "/api/fresns/v1/post/history/" + hpid + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Delete Post
 * @param {String} pid
 */
export const remove = (pid: string) => {
  return request({
    path: "/api/fresns/v1/post/" + pid,
    method: "DELETE",
  });
};
