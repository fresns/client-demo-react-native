/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import EventEmitter from "eventemitter3";

export const eventManager = new EventEmitter<EventTypes, any>();

export interface EventTypes {
  onChangeUser: (user: any) => any;
  onChangeGroup: (group: any) => any;
  onChangeHashtag: (hashtag: any) => any;
  onChangeGeotag: (geotag: any) => any;
  onChangePost: (post: any) => any;
  onChangeComment: (comment: any) => any;
}
