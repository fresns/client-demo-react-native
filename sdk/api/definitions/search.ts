/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Search Users
 * @param {Object} options
 */
export const users = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/users",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Search Groups
 * @param {Object} options
 */
export const groups = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/groups",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Search Hashtags
 * @param {Object} options
 */
export const hashtags = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/hashtags",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Search Geotags
 * @param {Object} options
 */
export const geotags = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/geotags",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Search Posts
 * @param {Object} options
 */
export const posts = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/posts",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Search Comments
 * @param {Object} options
 */
export const comments = (options = {}) => {
  return request({
    path: "/api/fresns/v1/search/comments",
    method: "GET",
    params: {
      ...options,
    },
  });
};
