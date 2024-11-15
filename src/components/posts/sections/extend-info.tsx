import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { isLogicEmpty } from "../../../../sdk/utilities/toolkit";

interface Props {
  post: any;
}

export const PostsExtendInfo: React.FC<Props> = (props) => {
  const {
    extends: { infos },
  } = props.post;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
      {item.image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
      )}
      <View style={styles.content}>
        {item.title && <Text style={[styles.title, { color: item.titleColor || "#000" }]}>{item.title}</Text>}
        {item.descPrimary && (
          <Text style={[styles.descPrimary, { color: item.descPrimaryColor || "#000" }]}>{item.descPrimary}</Text>
        )}
        {item.descSecondary && (
          <Text style={[styles.descSecondary, { color: item.descSecondaryColor || "#666" }]}>{item.descSecondary}</Text>
        )}
      </View>
      {item.buttonName && (
        <View style={styles.buttonContainer}>
          <Text style={[styles.button, { backgroundColor: item.buttonColor || "#fff" }]}>{item.buttonName}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLogicEmpty(infos)) {
    return null;
  }

  return (
    <FlatList
      data={infos}
      renderItem={renderItem}
      keyExtractor={(item) => item.eid}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descPrimary: {
    fontSize: 14,
    marginTop: 4,
  },
  descSecondary: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    marginLeft: 10,
  },
  button: {
    padding: 5,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 12,
    color: "#fff",
  },
});
