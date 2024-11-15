/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Editor Configs
 * @param {String} type post, comment
 */
export const configs = (type) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/configs",
    method: "GET",
  });
};

/**
 * Quick Publish
 * @param {String} type post, comment
 * @param {Object} formData
 */
export const publish = async (type, formData) => {
  return request({
    path: '/api/fresns/v1/editor/' + type + '/publish',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}

/**
 * Edit Post or Comment
 * @param {String} type post, comment
 * @param {String} fsid pid or cid
 */
export const edit = (type, fsid) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/edit/" + fsid,
    method: "POST",
  });
};

/**
 * Draft: Create
 * @param {String} type post, comment
 * @param {Object} options
 */
export const draftCreate = (type, options = {}) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/draft",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * Draft: List
 * @param {String} type post, comment
 * @param {Object} options
 */
export const draftList = (type, options = {}) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/drafts",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Draft: Detail
 * @param {String} type post, comment
 * @param {String} did
 * @param {Object} options
 */
export const draftDetail = (type, did, options = {}) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/draft/" + did,
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Draft: Update
 * @param {String} type post, comment
 * @param {String} did
 * @param {Object} options
 */
export const draftUpdate = (type, did, options = {}) => {
  return request(
    {
      path: "/api/fresns/v1/editor/" + type + "/draft/" + did,
      method: "PATCH",
      data: {
        ...options,
      },
    },
    false
  );
};

/**
 * Draft: Publish
 * @param {String} type post, comment
 * @param {String} did
 */
export const draftPublish = (type, did) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/draft/" + did,
    method: "POST",
  });
};

/**
 * Draft: Recall (Draft under review)
 * @param {String} type post, comment
 * @param {String} did
 */
export const draftRecall = (type, did) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/draft/" + did,
    method: "PUT",
  });
};

/**
 * Draft: Delete
 * @param {String} type post, comment
 * @param {String} did
 */
export const draftRemove = (type, did) => {
  return request({
    path: "/api/fresns/v1/editor/" + type + "/draft/" + did,
    method: "DELETE",
  });
};
