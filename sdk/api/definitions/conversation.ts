/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Conversation List
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const list = (options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/list",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Conversation Detail
 * @param {String} uidOrUsername
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const detail = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/" + uidOrUsername + "/detail",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Conversation Messages
 * @param {String} uidOrUsername
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const messages = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/" + uidOrUsername + "/messages",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Pin Conversation
 * @param {String} uidOrUsername
 * @return {wx.RequestTask}
 */
export const pin = (uidOrUsername) => {
  return request({
    path: "/api/fresns/v1/conversation/" + uidOrUsername + "/pin",
    method: "PATCH",
    data: {},
  });
};

/**
 * Mark As Read
 * @param {String} uidOrUsername
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const markAsRead = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/" + uidOrUsername + "/read-status",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * Delete Conversation or Messages
 * @param {String} uidOrUsername
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const remove = (uidOrUsername, options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/" + uidOrUsername,
    method: "DELETE",
    data: {
      ...options,
    },
  });
};

/**
 * Send Message
 * @param {String} uidOrUsername
 * @param {Object} options
 * @return {wx.RequestTask}
 */
export const sendMessage = (options = {}) => {
  return request({
    path: "/api/fresns/v1/conversation/message",
    method: "POST",
    data: {
      ...options,
    },
  });
};
