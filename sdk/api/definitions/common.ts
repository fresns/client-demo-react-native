/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * IP Information
 * @param {Object} options
 */
export const ipInfo = (options = {}) => {
  return request({
    path: "/api/fresns/v1/common/ip-info",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Input Tips
 * @param {Object} options
 */
export const inputTips = (options = {}) => {
  return request({
    path: "/api/fresns/v1/common/input-tips",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * Command Word Request
 * @param {Object} options
 */
export const cmdWord = (options = {}) => {
  return request({
    path: "/api/fresns/v1/common/cmd-word",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * File: Make S3 Upload Token
 * @param {Object} options
 */
export const fileUploadToken = (options = {}) => {
  return request({
    path: "/api/fresns/v1/common/file/upload-token",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * File: Upload
 */
// Jevan Note: upload file
export const fileUpload = (formData: any) => {
  return request({
    path: "/api/fresns/v1/common/file/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
};

/**
 * File: Update Info
 * @param {String} fid file id
 * @param {Object} options
 */
export const fileUpdate = (fid, options = {}) => {
  return request({
    path: "/api/fresns/v1/common/file/" + fid + "/info",
    method: "PATCH",
    data: {
      ...options,
    },
  });
};

/**
 * File: Download Link
 * @param {String} fid file id
 * @param {Object} options
 */
export const fileLink = (fid, options = {}) => {
  return request({
    path: "/api/fresns/v1/common/file/" + fid + "/link",
    method: "GET",
    params: {
      ...options,
    },
  });
};

/**
 * File: Download Users
 * @param {String} fid file id
 * @param {Object} options
 */
export const fileUsers = (fid, options = {}) => {
  return request({
    path: "/api/fresns/v1/common/file/" + fid + "/users",
    method: "GET",
    params: {
      ...options,
    },
  });
};
