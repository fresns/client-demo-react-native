/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Notification List
 * @param {Object} options
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/notification/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Mark As Read
 * @param {Object} options
 */
export const markAsRead = (options = {}) => {
  return request({
    path: "/api/fresns/v1/notification/read-status",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * Delete Messages
 * @param {Object} options
 */
export const remove = (options = {}) => {
  return request({
    path: "/api/fresns/v1/notification/messages",
    method: "DELETE",
    data: {
      ...options,
    },
  });
};
