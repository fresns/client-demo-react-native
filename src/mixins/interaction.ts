import { isNil } from "lodash";
import { toJS } from "mobx";
import { BasicStore } from "../../sdk/utilities";

export class Interaction {
  onChangeProfile<T extends BasicStore<{ profile: any }>>(store: T, newUser: any) {
    store.setData({
      profile: newUser,
    });
  }

  onChangeUser<T extends BasicStore<{ user?: any; users?: any[] }>>(store: T, newUser: any) {
    if (!isNil(store.data.user)) {
      store.setData({ user: newUser });
    }
    if (!isNil(store.data.users)) {
      const users = toJS(store.data.users);
      if (isNil(users)) {
        return;
      }
      const idx = users.findIndex((v) => v.uid === newUser.uid);
      if (idx === -1) {
        return;
      }
      store.setData({
        users: users.slice(0, idx).concat(newUser, users.slice(idx + 1)),
      });
    }
  }

  onChangeGroup<T extends BasicStore<{ group?: any; groups?: any[] }>>(store: T, newGroup: any) {
    if (!isNil(store.data.group)) {
      store.setData({ group: newGroup });
    }
    if (!isNil(store.data.groups)) {
      const groups = toJS(store.data.groups);
      if (isNil(groups)) {
        return;
      }
      const idx = groups.findIndex((v) => v.gid === newGroup.gid);
      if (idx === -1) {
        return;
      }
      store.setData({
        groups: groups.slice(0, idx).concat(newGroup, groups.slice(idx + 1)),
      });
    }
  }

  onChangeHashtag<T extends BasicStore<{ hashtag?: any; hashtags?: any[] }>>(store: T, newHashtag: any) {
    if (!isNil(store.data.hashtag)) {
      store.setData({ hashtag: newHashtag });
    }
    if (!isNil(store.data.hashtags)) {
      const hashtags = toJS(store.data.hashtags);
      if (isNil(hashtags)) {
        return;
      }
      const idx = hashtags.findIndex((v) => v.htid === newHashtag.htid);
      if (idx === -1) {
        return;
      }
      store.setData({
        hashtags: hashtags.slice(0, idx).concat(newHashtag, hashtags.slice(idx + 1)),
      });
    }
  }

  onChangeGeotag<T extends BasicStore<{ geotag?: any; geotags?: any[] }>>(store: T, newGeotag: any) {
    if (!isNil(store.data.geotag)) {
      store.setData({ geotag: newGeotag });
    }
    if (!isNil(store.data.geotags)) {
      const geotags = toJS(store.data.geotags);
      if (isNil(geotags)) {
        return;
      }
      const idx = geotags.findIndex((v) => v.gtid === newGeotag.gtid);
      if (idx === -1) {
        return;
      }
      store.setData({
        geotags: geotags.slice(0, idx).concat(newGeotag, geotags.slice(idx + 1)),
      });
    }
  }

  onChangePost<T extends BasicStore<{ post?: any; posts?: any[] }>>(store: T, newPost: any) {
    if (!isNil(store.data.post)) {
      store.setData({ post: newPost });
    }
    if (!isNil(store.data.posts)) {
      const posts = toJS(store.data.posts);
      if (isNil(posts)) {
        return;
      }
      const idx = posts.findIndex((v) => v.pid === newPost.pid);
      if (idx === -1) {
        return;
      }
      store.setData({
        posts: posts.slice(0, idx).concat(newPost, posts.slice(idx + 1)),
      });
    }
  }

  onChangeComment<T extends BasicStore<{ comment?: any; comments?: any[] }>>(store: T, newComment: any) {
    if (!isNil(store.data.comment)) {
      store.setData({ comment: newComment });
    }

    if (!isNil(store.data.comments)) {
      const comments = toJS(store.data.comments);
      if (isNil(comments)) {
        return;
      }
      const idx = comments.findIndex((v) => v.pid === newComment.pid);
      if (idx === -1) {
        return;
      }
      store.setData({
        comments: comments.slice(0, idx).concat(newComment, comments.slice(idx + 1)),
      });
    }
  }
}
