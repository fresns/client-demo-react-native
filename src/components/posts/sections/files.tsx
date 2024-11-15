import { Video } from "expo-av";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 示例数据，实际数据应该通过 props 或 state 传递
const files = {
  images: [
    {
      fid: "1",
      imageRatioUrl: "https://example.com/image1.jpg",
      imageSquareUrl: "https://example.com/image1-square.jpg",
      imageBigUrl: "https://example.com/image1-big.jpg",
    },
    {
      fid: "2",
      imageRatioUrl: "https://example.com/image2.jpg",
      imageSquareUrl: "https://example.com/image2-square.jpg",
      imageBigUrl: "https://example.com/image2-big.jpg",
    },
  ],
  videos: [
    { fid: "1", videoUrl: "https://example.com/video1.mp4", videoPosterUrl: "https://example.com/video1-poster.jpg" },
  ],
  audios: [{ fid: "1", name: "Audio 1", audioUrl: "https://example.com/audio1.mp3" }],
  documents: [{ fid: "1", name: "Document 1" }],
};

const previewImages = (url) => {
  // 预览图片的逻辑
  console.log("Preview image:", url);
};

const handleFileTap = (url) => {
  // 处理文件点击事件的逻辑
  console.log("File tapped:", url);
};

const downloadFile = (name) => {
  // 下载文件的逻辑
  console.log("Download file:", name);
};

export const PostsFiles = () => {
  const renderImages = ({ item }) => (
    <TouchableOpacity onPress={() => previewImages(item.imageBigUrl)}>
      <Image source={{ uri: item.imageRatioUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  const renderVideos = ({ item }) => (
    <View style={styles.videoContainer}>
      <Video source={{ uri: item.videoUrl }} style={styles.video} useNativeControls isLooping />
    </View>
  );

  const renderAudios = ({ item }) => (
    <View style={styles.audioContainer}>
      {/*<Audio*/}
      {/*  source={{ uri: item.audioUrl }}*/}
      {/*  style={styles.audio}*/}
      {/*  useNativeControls*/}
      {/*/>*/}
      <Text>{item.name}</Text>
    </View>
  );

  const renderDocuments = ({ item }) => (
    <TouchableOpacity onPress={() => downloadFile(item.name)} style={styles.documentContainer}>
      <View style={styles.docIcon}>
        <Text style={styles.iconFolder}>📁</Text>
      </View>
      <Text style={styles.docName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {files.images.length > 0 && (
        <FlatList data={files.images} renderItem={renderImages} keyExtractor={(item) => item.fid} horizontal />
      )}
      {files.videos.length > 0 && (
        <FlatList data={files.videos} renderItem={renderVideos} keyExtractor={(item) => item.fid} horizontal />
      )}
      {files.audios.length > 0 && (
        <FlatList data={files.audios} renderItem={renderAudios} keyExtractor={(item) => item.fid} horizontal />
      )}
      {files.documents.length > 0 && (
        <FlatList data={files.documents} renderItem={renderDocuments} keyExtractor={(item) => item.fid} horizontal />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  videoContainer: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  audio: {
    width: 100,
    height: 30,
    marginRight: 10,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  docIcon: {
    marginRight: 10,
  },
  iconFolder: {
    fontSize: 24,
  },
  docName: {
    fontSize: 16,
  },
});
