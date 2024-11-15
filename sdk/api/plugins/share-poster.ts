/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { request } from "../tool/request";

// Generate Share Poster
export const generateSharePoster = (options = {}) => {
  return request({
    path: "/api/share-poster/generate",
    method: "GET",
    params: {
      ...options,
    },
  });
};
