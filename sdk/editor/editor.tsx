/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { rpx } from "../helpers/rpx";
import { useEditorStore } from "./editor.store";
import { EditorArchives } from "./expands/archives/archives";
import { EditorInfoBox } from "./expands/content/info-box";
import { EditorTextBox } from "./expands/content/text-box";
import { EditorReadConfig } from "./expands/read-config/read-config";
import { EditorContent } from "./sections/content/content";
import { EditorDraftSelector } from "./sections/draft-selector/draft-selector";
import { EditorFiles } from "./sections/files/files";
import { EditorGroup } from "./sections/group/group";
import { EditorHashtag } from "./sections/hashtag/hashtag";
import { EditorMention } from "./sections/mention/mention";
import { EditorQuotedPost } from "./sections/quoted-post/quoted-post";
import { EditorTitle } from "./sections/title/title";
import { EditorToolbar } from "./sections/toolbar/toolbar";
import { EditorPublishLimit } from "./tips/publish-limit/publish-limit";
import { EditorPublishPerm } from "./tips/publish-perm/publish-perm";

interface Props {
  type?: "post" | "comment" | string;
  options?: any;
  did?: string;
  fsid?: string;
}

export const EditorItem: React.FC<Props> = observer((props) => {
  const { store, initAndUnloadStore } = useEditorStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndUnloadStore();

  if (data.isPending) {
    return null;
  }

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <ScrollView contentContainerStyle={{ minHeight: "100%", paddingBottom: rpx(180) }}>
        <View>
          {(data.publishPerm.draft === false || data.publishPerm.publish === false) && (
            <EditorPublishPerm publishPerm={data.publishPerm} />
          )}
          {data.publishLimit.status && data.publishLimit.isInTime && (
            <EditorPublishLimit publishLimit={data.publishLimit} />
          )}
        </View>
        {data.draftSelector && (
          <EditorDraftSelector type={data.type} options={data.options} did={data.did} fsid={data.fsid} />
        )}
        {data.editorForm && (
          <View style={{ height: "100%" }}>
            {/* Group Selection */}
            {data.editorConfig.group.status && (
              <EditorGroup type={data.type} did={data.did} group={data.draftDetail.group} />
            )}

            {/* Title input area */}
            {data.titleInputShow && <EditorTitle type={data.type} did={data.did} title={data.draftDetail.title} />}

            {/* Content area */}
            <EditorContent
              type={data.type}
              did={data.did}
              content={data.draftDetail.content}
              isAnonymous={data.draftDetail.isAnonymous}
              geotag={data.draftDetail.geotag}
              locationInfo={data.draftDetail.locationInfo}
            />

            {/* Quote information */}
            {/*{data.draftDetail.quotedPid && (*/}
            <EditorQuotedPost type={data.type} did={data.did} quotedPid={data.draftDetail.quotedPid} />
            {/*)}*/}

            {/* File */}
            <EditorFiles type={data.type} did={data.did} files={data.draftDetail.files} />

            {/* Extended content */}
            {data.draftDetail.extends?.texts?.length > 0 && (
              <EditorTextBox type={data.type} did={data.did} texts={data.draftDetail.extends?.texts} />
            )}

            {data.draftDetail.extends?.infos?.length > 0 && (
              <EditorInfoBox type={data.type} did={data.did} infos={data.draftDetail.extends?.infos} />
            )}

            <EditorArchives
              type={data.type}
              did={data.did}
              archives={data.draftDetail.archives}
              archiveGroupConfigs={data.archiveGroupConfigs}
            />

            {/* Extended Functions */}
            {data.draftDetail.permissions?.readConfig?.isReadLocked && (
              <EditorReadConfig type={data.type} did={data.did} readConfig={data.draftDetail.permissions.readConfig} />
            )}

            {/* @ User */}
            {data.mentionDialogShow && <EditorMention onClose={() => store.setData({ mentionDialogShow: false })} />}
            {/* # Hashtag */}
            {data.hashtagDialogShow && <EditorHashtag onClose={() => store.setData({ hashtagDialogShow: false })} />}

            {/* Jevan Note: lang btn */}
            <View style={styles.draftSubmit} onTouchEnd={() => store.onSubmitPublish()}>
              <Text style={styles.draftSubmitText}>Submit</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Toolbar */}
      {data.editorForm && <EditorToolbar type={data.type} did={data.did} />}
    </View>
  );
});

EditorItem.defaultProps = {
  type: "post",
  options: {},
};

const styles = StyleSheet.create({
  draftSubmit: {
    marginTop: rpx(40),
    width: rpx(320),
    height: rpx(80),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: rpx(12),
    marginLeft: "auto",
    marginRight: "auto",
  },
  draftSubmitText: {
    color: "#FFF",
    fontSize: rpx(32),
    fontWeight: "bold",
  },
});
