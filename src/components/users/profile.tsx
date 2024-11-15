import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useProfileItemStore } from "./profile.store";
import { UserInteraction } from "./sections/interaction";

interface Props {
  user: any;
  followersYouKnow: any[];
  items: any;
}

export const UserProfileItem: React.FC<Props> = observer((props) => {
  const { user, followersYouKnow, items } = props;
  const { store, initAndResetStore } = useProfileItemStore();
  const data = toJS(store.data);

  initAndResetStore();
  useEffect(() => {
    store.handleProps(props);
  }, [props]);

  if (data.isPending) {
    return null;
  }

  return (
    <View>
      <View>
        <View>
          <View>
            {user.decorate && <Image source={{ uri: user.decorate }} style={{ width: 100, height: 100 }} />}
            {user.avatar && <Image source={{ uri: user.avatar }} style={{ width: 100, height: 100 }} />}
          </View>
        </View>

        <View>
          <UserInteraction user={user} />
          {items.manages.length > 0 && (
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={
                  data.buttonIcons?.more
                    ? { uri: data.buttonIcons?.more }
                    : require("../../../assets/images/interaction/content-more.png")
                }
                style={{ marginRight: -2 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View>
        <View>
          <Text style={{ color: user.nicknameColor }}>{user.nickname}</Text>
          <Text>@{user.fsid}</Text>
          {user.roleIconDisplay && <Image source={{ uri: user.roleIcon }} style={{ height: "auto" }} />}
          {user.roleNameDisplay && (
            <View>
              <Text>{user.roleName}</Text>
            </View>
          )}
        </View>

        {user.verified && (
          <View>
            <View>
              <Image
                source={
                  user.verifiedIcon ? { uri: user.verifiedIcon } : require("../../../assets/images/icon-verified.png")
                }
              />
            </View>
            <View>
              <Text>{user.verifiedDesc}</Text>
            </View>
          </View>
        )}

        {user.bio && (
          <View>
            <Text>{user.bioHtml}</Text>
          </View>
        )}

        <View>
          <View>
            <TouchableOpacity onPress={() => {}}>
              <Text>
                {user.stats.followUserCount} {data.fresnsLang.userFollowing}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => {}}>
              <Text>
                {user.stats.followerCount} {user.interaction.followUserTitle}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!data.isMe && data.followersYouFollowEnabled && followersYouKnow.length > 0 && (
          <TouchableOpacity onPress={() => {}}>
            {followersYouKnow.map((item, index) => (
              <Text key={index}>
                {item.nickname}
                {index < followersYouKnow.length - 1 ? "," : ""}
              </Text>
            ))}
            <Text>{data.fresnsLang.userFollowersYouKnow}</Text>
          </TouchableOpacity>
        )}
      </View>

      {data.showMoreSheet && (
        <TouchableOpacity onPress={() => {}}>
          <View>
            <View>
              {items.manages.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => {}} style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.icon && <Image source={{ uri: item.icon }} style={{ aspectRatio: 1 }} />}
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <TouchableOpacity onPress={() => {}}>
                <Text>{data.fresnsLang.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
});
