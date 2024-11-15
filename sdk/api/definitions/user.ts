/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { ApiRespPromise } from "../index";
import { request } from "../tool/request";

/**
 * Create User Token (Login)
 * @param {Object} options
 */
export const login = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/auth-token",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * User Overview
 * @param {Object} options
 */
export const overview = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/overview",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Extcredits Records
 * @param {Object} options
 */
export const extcreditsRecords = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/extcredits-records",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Update Profile
 * @param {Object} options
 */
export const updateProfile = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/profile",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * Update Setting
 * @param {Object} options
 */
export const updateSetting = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/setting",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * Mark
 * @param {Object} options
 */
export const mark = (options = {}): ApiRespPromise<any> => {
  return request({
    path: "/api/fresns/v1/user/mark",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * Mark Note
 * @param {Object} options
 */
export const updateMarkNote = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/mark-note",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * Extend Action
 * @param {Object} options
 */
export const extendAction = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/extend-action",
    method: "POST",
    data: {
      ...options,
    },
  });
};

// Interactive

/**
 * User List
 * @param {Object} options
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/user/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * User Detail
 * @param {String} uidOrUsername
 * @param {Object} options
 */
export const detail = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/user/" + uidOrUsername + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Followers You Know
 * @param {String} uidOrUsername
 * @param {Object} options
 */
export const followersYouKnow = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/user/" + uidOrUsername + "/followers-you-follow",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * User Interaction Users
 * @param {String} uidOrUsername
 * @param {String} type likers, dislikers, followers, blockers
 * @param {Object} options
 */
export const interaction = (uidOrUsername, type, options = {}) => {
  return request({
    path: "/api/fresns/v1/user/" + uidOrUsername + "/interaction/" + type,
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * User Mark List
 * @param {String} uidOrUsername
 * @param {String} markType like, dislike, follow, block
 * @param {String} listType users, groups, hashtags, geotags, posts, comments
 * @param {Object} options
 */
export const markList = (uidOrUsername, markType, listType, options = {}) => {
  return request({
    path: "/api/fresns/v1/user/" + uidOrUsername + "/mark/" + markType + "/" + listType,
    method: "GET",
    params: {
      ...options,
    },
  });
};
