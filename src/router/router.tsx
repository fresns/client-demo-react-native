import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { WebView } from "../../sdk/extensions/web-view/web-view";
import { Debug } from "../components/debug/debug";
import { Comments } from "../pages/comments";
import { CommentsBlocking } from "../pages/comments/blocking";
import { CommentsDetail } from "../pages/comments/detail";
import { CommentsDislikes } from "../pages/comments/dislikes";
import { CommentsFollowing } from "../pages/comments/following";
import { CommentsLikes } from "../pages/comments/likes";
import { CommentsList } from "../pages/comments/list";
import { Conversations } from "../pages/conversations";
import { ConversationsMessages } from "../pages/conversations/messages";
import { Editor } from "../pages/editor";
import { Geotags } from "../pages/geotags";
import { GeotagsBlocking } from "../pages/geotags/blocking";
import { GeotagsDetail } from "../pages/geotags/detail";
import { GeotagsDislikes } from "../pages/geotags/dislikes";
import { GeotagsFollowing } from "../pages/geotags/following";
import { GeotagsLikes } from "../pages/geotags/likes";
import { GeotagsList } from "../pages/geotags/list";
import { Groups } from "../pages/groups";
import { GroupsBlocking } from "../pages/groups/blocking";
import { GroupsDetail } from "../pages/groups/detail";
import { GroupsDislikes } from "../pages/groups/dislikes";
import { GroupsFollowing } from "../pages/groups/following";
import { GroupsLikes } from "../pages/groups/likes";
import { GroupsList } from "../pages/groups/list";
import { Hashtags } from "../pages/hashtags";
import { HashtagsBlocking } from "../pages/hashtags/blocking";
import { HashtagsDetail } from "../pages/hashtags/detail";
import { HashtagsDislikes } from "../pages/hashtags/dislikes";
import { HashtagsFollowing } from "../pages/hashtags/following";
import { HashtagsLikes } from "../pages/hashtags/likes";
import { HashtagsList } from "../pages/hashtags/list";
import { Me } from "../pages/me";
import { MeDrafts } from "../pages/me/drafts";
import { MeExtCredits } from "../pages/me/extcredits";
import { MeSetting } from "../pages/me/settings";
import { MeUsers } from "../pages/me/users";
import { MeWallet } from "../pages/me/wallet";
import { Nearby } from "../pages/nearby";
import { NearbyComments } from "../pages/nearby/comments";
import { NearbyPosts } from "../pages/nearby/posts";
import { Notifications } from "../pages/notifications";
import { Portal } from "../pages/portal";
import { PortalAbout } from "../pages/portal/about";
import { PortalPolicies } from "../pages/portal/policies";
import { Posts } from "../pages/posts";
import { PostsBlocking } from "../pages/posts/blocking";
import { PostsDetail } from "../pages/posts/detail";
import { PostsDislikes } from "../pages/posts/dislikes";
import { PostsFollowing } from "../pages/posts/following";
import { PostsLikes } from "../pages/posts/likes";
import { PostsList } from "../pages/posts/list";
import { ProfileBlockingComments } from "../pages/profile/blocking/comments";
import { ProfileBlockingGeotags } from "../pages/profile/blocking/geotags";
import { ProfileBlockingGroups } from "../pages/profile/blocking/groups";
import { ProfileBlockingHashtags } from "../pages/profile/blocking/hashtags";
import { ProfileBlockingPosts } from "../pages/profile/blocking/posts";
import { ProfileBlockingUsers } from "../pages/profile/blocking/users";
import { ProfileComments } from "../pages/profile/comments";
import { ProfileDislikesComments } from "../pages/profile/dislikes/comments";
import { ProfileDislikesGeotags } from "../pages/profile/dislikes/geotags";
import { ProfileDislikesGroups } from "../pages/profile/dislikes/groups";
import { ProfileDislikesHashtags } from "../pages/profile/dislikes/hashtags";
import { ProfileDislikesPosts } from "../pages/profile/dislikes/posts";
import { ProfileDislikesUsers } from "../pages/profile/dislikes/users";
import { ProfileFollowingComments } from "../pages/profile/following/comments";
import { ProfileFollowingGeotags } from "../pages/profile/following/geotags";
import { ProfileFollowingGroups } from "../pages/profile/following/groups";
import { ProfileFollowingHashtags } from "../pages/profile/following/hashtags";
import { ProfileFollowingPosts } from "../pages/profile/following/posts";
import { ProfileFollowingUsers } from "../pages/profile/following/users";
import { ProfileInteractionsBlockers } from "../pages/profile/interactions/blockers";
import { ProfileInteractionsDislikers } from "../pages/profile/interactions/dislikers";
import { ProfileInteractionsFollowers } from "../pages/profile/interactions/followers";
import { ProfileInteractionsFollowersYouFollow } from "../pages/profile/interactions/followers-you-follow";
import { ProfileInteractionsLikers } from "../pages/profile/interactions/likers";
import { ProfileLikesComments } from "../pages/profile/likes/comments";
import { ProfileLikesGeotags } from "../pages/profile/likes/geotags";
import { ProfileLikesGroups } from "../pages/profile/likes/groups";
import { ProfileLikesHashtags } from "../pages/profile/likes/hashtags";
import { ProfileLikesPosts } from "../pages/profile/likes/posts";
import { ProfileLikesUsers } from "../pages/profile/likes/users";
import { ProfilePosts } from "../pages/profile/posts";
import { Search } from "../pages/search";
import { Timelines } from "../pages/timelines";
import { TimelinesComments } from "../pages/timelines/comments";
import { TimelinesGeotagComments } from "../pages/timelines/geotag-comments";
import { TimelinesGeotagPosts } from "../pages/timelines/geotag-posts";
import { TimelinesGroupComments } from "../pages/timelines/group-comments";
import { TimelinesGroupPosts } from "../pages/timelines/group-posts";
import { TimelinesHashtagComments } from "../pages/timelines/hashtag-comments";
import { TimelinesHashtagPosts } from "../pages/timelines/hashtag-posts";
import { TimelinesPosts } from "../pages/timelines/posts";
import { TimelinesUserComments } from "../pages/timelines/user-comments";
import { TimelinesUserPosts } from "../pages/timelines/user-posts";
import { Users } from "../pages/users";
import { UsersBlocking } from "../pages/users/blocking";
import { UsersDislikes } from "../pages/users/dislikes";
import { UsersFollowing } from "../pages/users/following";
import { UsersLikes } from "../pages/users/likes";
import { UsersList } from "../pages/users/list";
import { navigationRef } from "./navigate";
import { ScreenName } from "./screen-name";

const Tab = createBottomTabNavigator<any>();
const Stack = createNativeStackNavigator();

const X = () => (
  <Debug
    title={"测试"}
    records={[
      { label: "名称", value: "张三" },
      { label: "年龄", value: 30 },
    ]}
  />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={ScreenName.Test} options={{ tabBarLabel: "测试" }} component={X} />

      {/* 门户相关 */}
      <Tab.Screen name={ScreenName.Portal} options={{ tabBarLabel: "门户" }} component={Portal} />

      {/* 用户相关 */}
      <Tab.Screen name={ScreenName.Users} options={{ tabBarLabel: "用户" }} component={Users} />

      {/* 群组相关 */}
      <Tab.Screen name={ScreenName.Groups} options={{ tabBarLabel: "群组" }} component={Groups} />

      {/* 话题相关 */}
      <Tab.Screen name={ScreenName.Hashtags} options={{ tabBarLabel: "话题" }} component={Hashtags} />

      {/* 地理相关 */}
      <Tab.Screen name={ScreenName.Geotags} options={{ tabBarLabel: "地理" }} component={Geotags} />

      {/* 帖子 */}
      <Tab.Screen name={ScreenName.Posts} options={{ tabBarLabel: "帖子" }} component={Posts} />

      {/* 评论 */}
      <Tab.Screen name={ScreenName.Comments} options={{ tabBarLabel: "评论" }} component={Comments} />

      {/* 时间轴 */}
      <Tab.Screen name={ScreenName.Timelines} options={{ tabBarLabel: "时间轴" }} component={Timelines} />

      {/* 附近 */}
      <Tab.Screen name={ScreenName.Nearby} options={{ tabBarLabel: "附近" }} component={Nearby} />

      {/* 通知 */}
      <Tab.Screen name={ScreenName.Notifications} options={{ tabBarLabel: "通知" }} component={Notifications} />

      {/* 会话 */}
      <Tab.Screen name={ScreenName.Conversations} options={{ tabBarLabel: "会话" }} component={Conversations} />

      {/* 搜索 */}
      <Tab.Screen name={ScreenName.Search} options={{ tabBarLabel: "搜索" }} component={Search} />

      {/* 我的 */}
      <Tab.Screen name={ScreenName.Me} options={{ tabBarLabel: "我的" }} component={Me} />
    </Tab.Navigator>
  );
};

export const Router = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={ScreenName.TabNavigator}>
        {/* 首页底部 Tab */}
        <Stack.Screen options={{ headerShown: false }} name={ScreenName.TabNavigator} component={TabNavigator} />

        {/* 门户相关 */}
        <Stack.Screen name={ScreenName.Portal} component={Portal} />
        <Stack.Screen name={ScreenName.PortalAbout} component={PortalAbout} />
        <Stack.Screen name={ScreenName.PortalPolicies} component={PortalPolicies} />

        {/* 用户相关 */}
        <Stack.Screen name={ScreenName.Users} component={Users} />
        <Stack.Screen name={ScreenName.UsersBlocking} component={UsersBlocking} />
        <Stack.Screen name={ScreenName.UsersDislikes} component={UsersDislikes} />
        <Stack.Screen name={ScreenName.UsersFollowing} component={UsersFollowing} />
        <Stack.Screen name={ScreenName.UsersLikes} component={UsersLikes} />
        <Stack.Screen name={ScreenName.UsersList} component={UsersList} />

        {/* 群组相关 */}
        <Stack.Screen name={ScreenName.Groups} component={Groups} />
        <Stack.Screen name={ScreenName.GroupsBlocking} component={GroupsBlocking} />
        <Stack.Screen name={ScreenName.GroupsDislikes} component={GroupsDislikes} />
        <Stack.Screen name={ScreenName.GroupsFollowing} component={GroupsFollowing} />
        <Stack.Screen name={ScreenName.GroupsLikes} component={GroupsLikes} />
        <Stack.Screen name={ScreenName.GroupsList} component={GroupsList} />
        <Stack.Screen name={ScreenName.GroupsDetail} component={GroupsDetail} />

        {/* 话题相关 */}
        <Stack.Screen name={ScreenName.Hashtags} component={Hashtags} />
        <Stack.Screen name={ScreenName.HashtagsBlocking} component={HashtagsBlocking} />
        <Stack.Screen name={ScreenName.HashtagsDislikes} component={HashtagsDislikes} />
        <Stack.Screen name={ScreenName.HashtagsFollowing} component={HashtagsFollowing} />
        <Stack.Screen name={ScreenName.HashtagsLikes} component={HashtagsLikes} />
        <Stack.Screen name={ScreenName.HashtagsList} component={HashtagsList} />
        <Stack.Screen name={ScreenName.HashtagsDetail} component={HashtagsDetail} />

        {/* 地理相关 */}
        <Stack.Screen name={ScreenName.Geotags} component={Geotags} />
        <Stack.Screen name={ScreenName.GeotagsBlocking} component={GeotagsBlocking} />
        <Stack.Screen name={ScreenName.GeotagsDislikes} component={GeotagsDislikes} />
        <Stack.Screen name={ScreenName.GeotagsFollowing} component={GeotagsFollowing} />
        <Stack.Screen name={ScreenName.GeotagsLikes} component={GeotagsLikes} />
        <Stack.Screen name={ScreenName.GeotagsList} component={GeotagsList} />
        <Stack.Screen name={ScreenName.GeotagsDetail} component={GeotagsDetail} />

        {/* 帖子 */}
        <Stack.Screen name={ScreenName.Posts} component={Posts} />
        <Stack.Screen name={ScreenName.PostsBlocking} component={PostsBlocking} />
        <Stack.Screen name={ScreenName.PostsDislikes} component={PostsDislikes} />
        <Stack.Screen name={ScreenName.PostsFollowing} component={PostsFollowing} />
        <Stack.Screen name={ScreenName.PostsLikes} component={PostsLikes} />
        <Stack.Screen name={ScreenName.PostsList} component={PostsList} />
        <Stack.Screen name={ScreenName.PostsDetail} component={PostsDetail} />

        {/* 评论 */}
        <Stack.Screen name={ScreenName.Comments} component={Comments} />
        <Stack.Screen name={ScreenName.CommentsBlocking} component={CommentsBlocking} />
        <Stack.Screen name={ScreenName.CommentsDislikes} component={CommentsDislikes} />
        <Stack.Screen name={ScreenName.CommentsFollowing} component={CommentsFollowing} />
        <Stack.Screen name={ScreenName.CommentsLikes} component={CommentsLikes} />
        <Stack.Screen name={ScreenName.CommentsList} component={CommentsList} />
        <Stack.Screen name={ScreenName.CommentsDetail} component={CommentsDetail} />

        {/* 时间轴 */}
        <Stack.Screen name={ScreenName.Timelines} component={Timelines} />
        <Stack.Screen name={ScreenName.TimelinesComments} component={TimelinesComments} />
        <Stack.Screen name={ScreenName.TimelinesGeotagComments} component={TimelinesGeotagComments} />
        <Stack.Screen name={ScreenName.TimelinesGeotagPosts} component={TimelinesGeotagPosts} />
        <Stack.Screen name={ScreenName.TimelinesGroupComments} component={TimelinesGroupComments} />
        <Stack.Screen name={ScreenName.TimelinesGroupPosts} component={TimelinesGroupPosts} />
        <Stack.Screen name={ScreenName.TimelinesHashtagComments} component={TimelinesHashtagComments} />
        <Stack.Screen name={ScreenName.TimelinesHashtagPosts} component={TimelinesHashtagPosts} />
        <Stack.Screen name={ScreenName.TimelinesPosts} component={TimelinesPosts} />
        <Stack.Screen name={ScreenName.TimelinesUserComments} component={TimelinesUserComments} />
        <Stack.Screen name={ScreenName.TimelinesUserPosts} component={TimelinesUserPosts} />

        {/* 附近 */}
        <Stack.Screen name={ScreenName.Nearby} component={Nearby} />
        <Stack.Screen name={ScreenName.NearbyComments} component={NearbyComments} />
        <Stack.Screen name={ScreenName.NearbyPosts} component={NearbyPosts} />

        {/* 通知 */}
        <Stack.Screen name={ScreenName.Notifications} component={Notifications} />

        {/* 会话 */}
        <Stack.Screen name={ScreenName.Conversations} component={Conversations} />
        <Stack.Screen name={ScreenName.ConversationsMessages} component={ConversationsMessages} />

        {/* 搜索 */}
        <Stack.Screen name={ScreenName.Search} component={Search} />

        {/* 用户相关 */}
        <Stack.Screen name={ScreenName.ProfileComments} component={ProfileComments} />
        <Stack.Screen name={ScreenName.ProfilePosts} component={ProfilePosts} />

        <Stack.Screen name={ScreenName.ProfileBlockingComments} component={ProfileBlockingComments} />
        <Stack.Screen name={ScreenName.ProfileBlockingGeotags} component={ProfileBlockingGeotags} />
        <Stack.Screen name={ScreenName.ProfileBlockingGroups} component={ProfileBlockingGroups} />
        <Stack.Screen name={ScreenName.ProfileBlockingHashtags} component={ProfileBlockingHashtags} />
        <Stack.Screen name={ScreenName.ProfileBlockingPosts} component={ProfileBlockingPosts} />
        <Stack.Screen name={ScreenName.ProfileBlockingUsers} component={ProfileBlockingUsers} />

        <Stack.Screen name={ScreenName.ProfileDislikesComments} component={ProfileDislikesComments} />
        <Stack.Screen name={ScreenName.ProfileDislikesGeotags} component={ProfileDislikesGeotags} />
        <Stack.Screen name={ScreenName.ProfileDislikesGroups} component={ProfileDislikesGroups} />
        <Stack.Screen name={ScreenName.ProfileDislikesHashtags} component={ProfileDislikesHashtags} />
        <Stack.Screen name={ScreenName.ProfileDislikesPosts} component={ProfileDislikesPosts} />
        <Stack.Screen name={ScreenName.ProfileDislikesUsers} component={ProfileDislikesUsers} />

        <Stack.Screen name={ScreenName.ProfileFollowingComments} component={ProfileFollowingComments} />
        <Stack.Screen name={ScreenName.ProfileFollowingGeotags} component={ProfileFollowingGeotags} />
        <Stack.Screen name={ScreenName.ProfileFollowingGroups} component={ProfileFollowingGroups} />
        <Stack.Screen name={ScreenName.ProfileFollowingHashtags} component={ProfileFollowingHashtags} />
        <Stack.Screen name={ScreenName.ProfileFollowingPosts} component={ProfileFollowingPosts} />
        <Stack.Screen name={ScreenName.ProfileFollowingUsers} component={ProfileFollowingUsers} />

        <Stack.Screen name={ScreenName.ProfileLikesComments} component={ProfileLikesComments} />
        <Stack.Screen name={ScreenName.ProfileLikesGeotags} component={ProfileLikesGeotags} />
        <Stack.Screen name={ScreenName.ProfileLikesGroups} component={ProfileLikesGroups} />
        <Stack.Screen name={ScreenName.ProfileLikesHashtags} component={ProfileLikesHashtags} />
        <Stack.Screen name={ScreenName.ProfileLikesPosts} component={ProfileLikesPosts} />
        <Stack.Screen name={ScreenName.ProfileLikesUsers} component={ProfileLikesUsers} />

        <Stack.Screen name={ScreenName.ProfileInteractionsBlockers} component={ProfileInteractionsBlockers} />
        <Stack.Screen name={ScreenName.ProfileInteractionsDislikers} component={ProfileInteractionsDislikers} />
        <Stack.Screen name={ScreenName.ProfileInteractionsFollowers} component={ProfileInteractionsFollowers} />
        <Stack.Screen
          name={ScreenName.ProfileInteractionsFollowersYouFollow}
          component={ProfileInteractionsFollowersYouFollow}
        />
        <Stack.Screen name={ScreenName.ProfileInteractionsLikers} component={ProfileInteractionsLikers} />

        {/* 我的 */}
        <Tab.Screen name={ScreenName.Me} component={Me} />
        <Tab.Screen name={ScreenName.MeDrafts} component={MeDrafts} />
        <Tab.Screen name={ScreenName.MeExtCredits} component={MeExtCredits} />
        <Tab.Screen name={ScreenName.MeSetting} component={MeSetting} />
        <Tab.Screen name={ScreenName.MeUsers} component={MeUsers} />
        <Tab.Screen name={ScreenName.MeWallet} component={MeWallet} />

        {/* 编辑器 */}
        <Stack.Screen name={ScreenName.Editor} component={Editor} />

        {/* WebView */}
        <Stack.Screen name={ScreenName.WebView} component={WebView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
