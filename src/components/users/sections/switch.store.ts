import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../../sdk/utilities";
import { buildStore } from "../../../store";

class Data {
  isPending: boolean = true;

  postEnabled: boolean = true;
  postName: string = "帖子";
  commentEnabled: boolean = true;
  commentName: string = "评论";
  fresnsLang: any;

  fsid: any;
  likes: any[];
  dislikes: any[];
  following: any[];
  blocking: any[];
  interactions: any[];
}

class SwitchStore extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  init() {
    const { fresnsConfig, fresnsLang } = this.appStore.data;
    this.setData({
      isPending: false,

      postEnabled: get(fresnsConfig, "profile_posts_enabled"),
      postName: get(fresnsConfig, "post_name"),
      commentEnabled: get(fresnsConfig, "profile_comments_enabled"),
      commentName: get(fresnsConfig, "comment_name"),
      fresnsLang: {
        more: get(fresnsLang, "more"),
      },
    });
  }

  async handleProps(props: any) {
    const { user } = props;
    if (isNil(user)) {
      return;
    }

    const { fresnsConfig } = this.appStore.data;
    const fsid = user.fsid;

    const likes = [
      {
        status: get(fresnsConfig, "profile_likes_users_enabled"),
        text: get(fresnsConfig, "profile_likes_users_name"),
        link: "/pages/profile/likes/users?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_likes_groups_enabled"),
        text: get(fresnsConfig, "profile_likes_groups_name"),
        link: "/pages/profile/likes/groups?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_likes_hashtags_enabled"),
        text: get(fresnsConfig, "profile_likes_hashtags_name"),
        link: "/pages/profile/likes/hashtags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_likes_geotags_enabled"),
        text: get(fresnsConfig, "profile_likes_geotags_name"),
        link: "/pages/profile/likes/geotags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_likes_posts_enabled"),
        text: get(fresnsConfig, "profile_likes_posts_name"),
        link: "/pages/profile/likes/posts?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_likes_comments_enabled"),
        text: get(fresnsConfig, "profile_likes_comments_name"),
        link: "/pages/profile/likes/comments?fsid=" + fsid,
      },
    ];

    const dislikes = [
      {
        status: get(fresnsConfig, "profile_dislikes_users_enabled"),
        text: get(fresnsConfig, "profile_dislikes_users_name"),
        link: "/pages/profile/dislikes/users?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_dislikes_groups_enabled"),
        text: get(fresnsConfig, "profile_dislikes_groups_name"),
        link: "/pages/profile/dislikes/groups?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_dislikes_hashtags_enabled"),
        text: get(fresnsConfig, "profile_dislikes_hashtags_name"),
        link: "/pages/profile/dislikes/hashtags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_dislikes_geotags_enabled"),
        text: get(fresnsConfig, "profile_dislikes_geotags_name"),
        link: "/pages/profile/dislikes/geotags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_dislikes_posts_enabled"),
        text: get(fresnsConfig, "profile_dislikes_posts_name"),
        link: "/pages/profile/dislikes/posts?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_dislikes_comments_enabled"),
        text: get(fresnsConfig, "profile_dislikes_comments_name"),
        link: "/pages/profile/dislikes/comments?fsid=" + fsid,
      },
    ];

    const following = [
      {
        status: get(fresnsConfig, "profile_following_users_enabled"),
        text: get(fresnsConfig, "profile_following_users_name"),
        link: "/pages/profile/following/users?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_following_groups_enabled"),
        text: get(fresnsConfig, "profile_following_groups_name"),
        link: "/pages/profile/following/groups?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_following_hashtags_enabled"),
        text: get(fresnsConfig, "profile_following_hashtags_name"),
        link: "/pages/profile/following/hashtags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_following_geotags_enabled"),
        text: get(fresnsConfig, "profile_following_geotags_name"),
        link: "/pages/profile/following/geotags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_following_posts_enabled"),
        text: get(fresnsConfig, "profile_following_posts_name"),
        link: "/pages/profile/following/posts?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_following_comments_enabled"),
        text: get(fresnsConfig, "profile_following_comments_name"),
        link: "/pages/profile/following/comments?fsid=" + fsid,
      },
    ];

    const blocking = [
      {
        status: get(fresnsConfig, "profile_blocking_users_enabled"),
        text: get(fresnsConfig, "profile_blocking_users_name"),
        link: "/pages/profile/blocking/users?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_blocking_groups_enabled"),
        text: get(fresnsConfig, "profile_blocking_groups_name"),
        link: "/pages/profile/blocking/groups?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_blocking_hashtags_enabled"),
        text: get(fresnsConfig, "profile_blocking_hashtags_name"),
        link: "/pages/profile/blocking/hashtags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_blocking_geotags_enabled"),
        text: get(fresnsConfig, "profile_blocking_geotags_name"),
        link: "/pages/profile/blocking/geotags?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_blocking_posts_enabled"),
        text: get(fresnsConfig, "profile_blocking_posts_name"),
        link: "/pages/profile/blocking/posts?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_blocking_comments_enabled"),
        text: get(fresnsConfig, "profile_blocking_comments_name"),
        link: "/pages/profile/blocking/comments?fsid=" + fsid,
      },
    ];

    const interactions = [
      {
        status: get(fresnsConfig, "user_like_public_record") != 1,
        text: get(fresnsConfig, "profile_likers_name"),
        link: "/pages/profile/interactions/likers?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "user_dislike_public_record") != 1,
        text: get(fresnsConfig, "profile_dislikers_name"),
        link: "/pages/profile/interactions/dislikers?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "user_follow_public_record") != 1,
        text: get(fresnsConfig, "profile_followers_name"),
        link: "/pages/profile/interactions/followers?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "user_block_public_record") != 1,
        text: get(fresnsConfig, "profile_blockers_name"),
        link: "/pages/profile/interactions/blockers?fsid=" + fsid,
      },
      {
        status: get(fresnsConfig, "profile_followers_you_follow_enabled"),
        text: get(fresnsConfig, "profile_followers_you_follow_name"),
        link: "/pages/profile/interactions/followers-you-follow?fsid=" + fsid,
      },
    ];

    this.setData({
      fsid: fsid,
      likes: likes,
      dislikes: dislikes,
      following: following,
      blocking: blocking,
      interactions: interactions,
    });
  }

  onClickToPosts = () => {};

  onClickToComments = () => {};

  onClickMenus = (type: string) => {};
}

export const useSwitchStore = buildStore(() => new SwitchStore());
