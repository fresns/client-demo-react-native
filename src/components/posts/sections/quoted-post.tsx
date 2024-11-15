import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "./quoted-post.store";

interface Props {
  post: any;
}

export const PostsQuotedPost = observer((props: Props) => {
  const { post } = props;
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();
  useEffect(() => {
    store.handleProps(props);
  }, [props]);

  return (
    <View style={styles.quotedBox}>
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.quotedContent}>
          <View style={styles.flexRow}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: post.author.avatar }} style={styles.avatarImage} />
            </View>
            <View style={styles.contentContainer}>
              <Text>{data.newContent}</Text>
            </View>
          </View>
          {post.group && (
            <View style={styles.groupContainer}>
              <Text style={styles.groupText}>{post.group.name}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  quotedBox: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  quotedContent: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
  },
  groupContainer: {
    marginTop: 5,
  },
  groupText: {
    color: "#888",
    fontSize: 12,
  },
});
