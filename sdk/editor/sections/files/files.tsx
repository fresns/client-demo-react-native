/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./files.store";

interface Props {
  type: string;
  did: string;
  files: any;
}

export const EditorFiles: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  if (data.images.length === 0 && data.videos.length === 0 && data.audios.length === 0 && data.documents.length === 0) {
    return null;
  }

  return (
    <View style={styles.filesContainer}>
      {data.images.map((image) => {
        return <Image key={image.fid} style={styles.fileItem} source={{ uri: image.imageSquareUrl }} />;
      })}
      {data.videos.map((video) => {
        return <Image key={video.fid} style={styles.fileItem} source={{ uri: video.videoPosterUrl }} />;
      })}
      {data.audios.map((audio) => {
        return (
          <View key={audio.fid} style={styles.fileItem}>
            <Text>{audio.name}</Text>
          </View>
        );
      })}
      {data.documents.map((document) => {
        return (
          <View key={document.fid} style={styles.fileItem}>
            <Text>{document.name}</Text>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  filesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: rpx(32),
    rowGap: rpx(10),
    columnGap: rpx(10),
    justifyContent: "flex-start",
  },
  fileItem: {
    width: rpx(200),
    height: rpx(200),
  },
});
