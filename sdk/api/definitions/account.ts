/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

/**
 * Create Account Token (Login)
 * @param {Object} options
 */
export const login = (options = {}) => {
  return request({
    path: "/api/fresns/v1/account/auth-token",
    method: "POST",
    data: {
      ...options,
    },
  });
};

/**
 * Delete Account Token (Logout)
 */
export const logout = () => {
  return request({
    path: "/api/fresns/v1/account/auth-token",
    method: "DELETE",
  });
};

/**
 * Account Detail
 */
export const detail = () => {
  return request({
    path: "/api/fresns/v1/account/detail",
    method: "GET",
  });
};

/**
 * Wallet Records
 * @param {Object} options
 */
export const walletRecords = (options = {}) => {
  return request({
    path: "/api/fresns/v1/account/wallet-records",
    method: "GET",
    params: {
      ...options,
    },
  });
};
