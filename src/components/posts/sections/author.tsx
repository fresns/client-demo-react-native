import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "./author.store";

interface Props {
  post: any;
}

export const PostsAuthor: React.FC<Props> = observer((props) => {
  const { author, isAnonymous, createdTimeAgo, geotag } = props.post;
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();

  const renderAuthorContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contentDesc}>Content Description</Text>
        <Text style={styles.contentTime}>{createdTimeAgo}</Text>
        {geotag && (
          <TouchableOpacity onPress={() => {}} style={styles.geotagContainer}>
            <Text style={styles.iconLocation}>Icon</Text>
            <Text style={styles.geotagName}>{geotag.name}</Text>
            {geotag.distance && (
              <Text style={styles.geotagDistance}>
                ({geotag.distance} {geotag.unit})
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!author.status) {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: author.avatar }} style={styles.avatarImg} />
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.userDeactivate}>{data.userDeactivate}</Text>
          </View>
          {renderAuthorContent()}
        </View>
      </View>
    );
  }

  if (isAnonymous) {
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: author.avatar }} style={styles.avatarImg} />
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.userDeactivate}>{data.authorAnonymous}</Text>
          </View>
          {renderAuthorContent()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}} style={styles.avatarContainer}>
        {author.decorate && <Image source={{ uri: author.decorate }} style={styles.avatarDecorate} />}
        <Image source={{ uri: author.avatar }} style={styles.avatarImg} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.userInfo}>
          <Text style={[styles.userNickname, { color: author.nicknameColor || "#000" }]}>{author.nickname}</Text>
          {author.verified && (
            <Image
              source={{ uri: author.verifiedIcon || "/assets/images/icon-verified.png" }}
              style={styles.verifiedIcon}
            />
          )}
          <Text style={styles.userName}>@{author.fsid}</Text>
          {author.roleIconDisplay && <Image source={{ uri: author.roleIcon }} style={styles.roleIcon} />}
          {author.roleNameDisplay && <Text style={styles.roleName}>{author.roleName}</Text>}
        </TouchableOpacity>
        {author.operations.diversifyImages.length > 0 && (
          <View style={styles.userIcons}>
            {author.operations.diversifyImages.map((iconItem) => (
              <Image key={iconItem.code} source={{ uri: iconItem.imageUrl }} style={styles.diversifyImage} />
            ))}
          </View>
        )}
        {renderAuthorContent()}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatarImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarDecorate: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNickname: {
    fontWeight: "bold",
    marginRight: 5,
  },
  verifiedIcon: {
    width: 15,
    height: 15,
  },
  userName: {
    marginLeft: 5,
    color: "#888",
  },
  roleIcon: {
    width: 15,
    height: 15,
    marginLeft: 5,
  },
  roleName: {
    marginLeft: 5,
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 5,
    borderRadius: 3,
    fontSize: 12,
  },
  userIcons: {
    flexDirection: "row",
    marginTop: 5,
  },
  diversifyImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  contentContainer: {
    marginTop: 5,
  },
  contentDesc: {
    marginBottom: 5,
    fontSize: 14,
  },
  contentTime: {
    color: "#888",
    fontSize: 12,
  },
  geotagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  iconLocation: {
    marginRight: 5,
  },
  geotagName: {
    fontSize: 14,
  },
  geotagDistance: {
    marginLeft: 5,
    color: "#888",
    fontSize: 12,
  },
  userDeactivate: {
    fontSize: 14,
    color: "#888",
  },
});
