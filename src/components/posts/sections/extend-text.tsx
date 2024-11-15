import React from "react";
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";
import RenderHtml from "react-native-render-html";
import { isLogicEmpty } from "../../../../sdk/utilities/toolkit";

// 获取屏幕宽度
const contentWidth = Dimensions.get("window").width;

interface Props {
  post: any;
}

export const PostsExtendText: React.FC<Props> = (props) => {
  const {
    extends: { texts },
  } = props.post;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
      <View>
        {item.isMarkdown ? (
          <Markdown>{item.content}</Markdown>
        ) : (
          <RenderHtml contentWidth={contentWidth} source={{ html: item.content }} baseStyle={styles.html} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLogicEmpty(texts)) {
    return null;
  }

  return (
    <FlatList
      data={texts}
      renderItem={renderItem}
      keyExtractor={(item) => item.eid}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  html: {
    fontSize: 16,
    lineHeight: 24,
  },
});
