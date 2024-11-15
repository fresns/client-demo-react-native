import { toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import RenderHtml from "react-native-render-html";
import { useStore } from "./preview-comments.store";

interface Props {
  post: any;
}

export const PostsPreviewComments: React.FC<Props> = observer((props) => {
  const { pid, commentCount, previewComments } = props.post;
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  return (
    <View>
      {/* 热评 */}
      {previewComments.length === 1 && (
        <View>
          {/* 热评-标头 */}
          <View>
            <View>
              <Text>{data.contentTopComment}</Text>
            </View>
            <View>
              <Text>
                {previewComments[0].likeCount} {previewComments[0].interaction.likeName}
              </Text>
            </View>
          </View>

          {/* 热评-正文 */}
          <TouchableOpacity
            onPress={() => {
              /* Navigate to detail page with pid */
            }}
          >
            <View>
              {/* Assuming you have a RichText component to render the rich text content */}
              <RenderHtml source={previewComments[0].processedContent} />
            </View>
          </TouchableOpacity>

          {/* 热评-附带图片 */}
          {previewComments[0].files.images.length > 0 && (
            <View>
              {previewComments[0].files.images.map((imageItem, index) => (
                <Image key={index} source={{ uri: imageItem.imageSquareUrl }} style={{ width: "100%" }} />
              ))}
            </View>
          )}
        </View>
      )}

      {/* 多条评论预览 */}
      {previewComments.length > 1 && (
        <TouchableOpacity
          onPress={() => {
            /* Navigate to detail page with pid */
          }}
        >
          <View>
            <View>
              {previewComments.map((comment, index) => (
                <View key={index}>
                  {/* Assuming you have a RichText component to render the rich text content */}
                  <RenderHtml source={comment.processedContent} />
                </View>
              ))}
              <View>
                <Text>
                  {data.modifierCount} {commentCount} {data.contentCommentCountDesc}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
});
