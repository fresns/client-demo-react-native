/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { Debug } from "../../../../src/components/debug/debug"; // Jevan Note: component
import { BottomModal } from "../../../components/bottom-modal/bottom-modal";
import { rpx } from "../../../helpers/rpx";
import { useStore } from "./toolbar.store";

interface Props {
  type: string;
  did: string;
}

export const EditorToolbar: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  const { config, fresnsLang } = data;
  return (
    <View style={styles.toolbar}>
      {config.sticker && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("sticker")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <Path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
          </Svg>
          <Text>{fresnsLang.editorStickers}</Text>
        </View>
      )}
      {config.image.status && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("image")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            <Path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
          </Svg>
          <Text>{fresnsLang.editorImages}</Text>
        </View>
      )}
      {config.video.status && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("video")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
          </Svg>
          <Text>{fresnsLang.editorVideos}</Text>
        </View>
      )}
      {config.audio.status && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("audio")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
            <Path fillRule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
            <Path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
          </Svg>
          <Text>{fresnsLang.editorAudios}</Text>
        </View>
      )}
      {config.document.status && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("document")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7z" />
          </Svg>
          <Text>{fresnsLang.editorDocuments}</Text>
        </View>
      )}
      {config.title.status && !config.title.required && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("title")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2m12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
            <Path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386z" />
          </Svg>
          <Text>{fresnsLang.editorTitle}</Text>
        </View>
      )}
      {config.mention.status && config.mention.display && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("mention")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
          </Svg>
          <Text>{fresnsLang.editorMention}</Text>
        </View>
      )}
      {config.hashtag.status && config.hashtag.display && (
        <View style={styles.toolItem} onTouchEnd={() => store.onClickToolbar("hashtag")}>
          <Svg width={rpx(36)} height={rpx(36)} fill={"#707070"}>
            <Path d="M8.39 12.648a1 1 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1 1 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.51.51 0 0 0-.523-.516.54.54 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532s.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531s.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
          </Svg>
          <Text>{fresnsLang.editorHashtag}</Text>
        </View>
      )}
      {config.extend.status &&
        config.extend.list.length > 0 &&
        config.extend.list
          .filter((item) => item.isInToolbar)
          .map((item) => {
            return (
              <View style={styles.toolItem} onTouchEnd={() => store.goExtendPage(item)}>
                <Image width={rpx(36)} height={rpx(36)} source={{ uri: item.icon }} />
                <Text>{item.name}</Text>
              </View>
            );
          })}

      {data.stickerDialog && (
        <BottomModal
          onTouchMask={() => {
            store.setData({ stickerDialog: false });
          }}
        >
          <View style={styles.toolStickersHeader}>
            {data.stickers.map((set, index) => {
              return (
                <Text
                  key={index}
                  style={[styles.toolStickerTab, data.currentIndex === index && styles.toolStickerTabActive]}
                  onPress={() => store.switchStickers(index)}
                >
                  {set.name}
                </Text>
              );
            })}
          </View>
          <ScrollView style={{ height: rpx(300) }} contentContainerStyle={{ paddingBottom: rpx(40) }}>
            <View style={styles.toolStickers}>
              {data.currentStickers.map((set, index) => {
                return (
                  <View key={`${data.currentIndex}-${index}`} onTouchEnd={() => store.onSelectSticker(set)}>
                    <Image style={styles.toolStickerItem} source={{ uri: set.image }} />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </BottomModal>
      )}

      {data.extendDialog && (
        <Modal visible={true} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "90%",
                height: "80%",
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <ScrollView>
                {/* Jevan Note: lang */}
                <Debug
                  title={"Extends"}
                  records={[
                    {
                      label: "Options",
                      value: "Close",
                      action: "Close",
                      onAction: () => store.setData({ extendDialog: false }),
                    },
                  ].concat(
                    config.extend.list.map(
                      (extend: any) =>
                        ({
                          label: "Name",
                          value: extend.name,
                          action: "Option",
                          onAction: () => store.goExtendPage(extend),
                        } as any)
                    )
                  )}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: "#FFF",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: rpx(20),
    paddingBottom: rpx(20),
  },
  toolItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  toolStickersHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: rpx(8),
  },
  toolStickerTab: {
    padding: rpx(10),
    fontSize: rpx(28),
  },
  toolStickerTabActive: {
    borderBottomColor: "blue",
    borderBottomWidth: rpx(4),
  },
  toolStickers: {
    marginTop: rpx(20),
    display: "flex",
    flexDirection: "row",
    rowGap: rpx(24),
    columnGap: rpx(24),
    flexWrap: "wrap",
  },
  toolStickerItem: {
    width: rpx(60),
    height: rpx(60),
  },
});
