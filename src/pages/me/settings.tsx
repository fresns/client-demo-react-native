import * as ImagePicker from "expo-image-picker";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { ScrollView } from "react-native";
import { Debug } from "../../components/debug/debug";
import { Divider } from "../../components/divider/divider";
import { ToastMessage } from "../../components/message/toast-message";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { useStore } from "./settings.store";
import React from "react";

export const MeSetting = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();

  return (
    <ScrollView>
      <Debug
        title={"操作"}
        records={[
          {
            label: "操作",
            value: "重载用户信息",
            action: "重载",
            onAction: () => store.reloadFresnsUser(),
          },
          {
            label: "操作",
            value: "选择头像",
            action: "选择",
            onAction: async () => {
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

              if (permissionResult.granted === false) {
                ToastMessage.info({ title: "You've refused to allow this app to access your photos!" });
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
              });

              if (!result.canceled) {
                const source = { uri: result.assets[0].uri };
                await store.modifyAvatar(source.uri);
              }
            },
          },
          {
            label: "操作",
            value: "打印 Account",
            action: "打印",
            onAction: () => console.log(data.fresnsAccount),
          },
          {
            label: "操作",
            value: "打印 User",
            action: "打印",
            onAction: () => console.log(data.fresnsUser),
          },
          {
            label: "操作",
            value: "打印 Overview",
            action: "打印",
            onAction: () => console.log(data.fresnsOverview),
          },
        ]}
      />
      <Divider />
      <Debug
        title={"修改生日显示方式"}
        records={data.birthdayDisplayOptions.map((value, index) => {
          return {
            label: "操作",
            value: value,
            action: "切换",
            onAction: () => store.modifyBirthdayDisplayType(index + 1),
          };
        })}
      />
      <Divider />
      <Debug
        title={"修改性别"}
        records={data.genderOptions.map((value, index) => {
          return {
            label: "操作",
            value: value,
            action: "切换",
            onAction: () => store.modifyGender(index + 1),
          };
        })}
      />
      <Divider />
      {data.fresnsUser?.gender === 4 && (
        <Debug
          title={"性别: 自定义代称"}
          records={data.genderOptions.map((value, index) => {
            return {
              label: "操作",
              value: value,
              action: "切换",
              onAction: () => store.modifyGenderPronoun(index + 1),
            };
          })}
        />
      )}
      <Divider />
      <Debug
        title={"对话设置"}
        records={data.policyOptions.map((value, index) => {
          return {
            label: "操作",
            value: value,
            action: "切换",
            onAction: () => store.modifyConversationPolicy(index + 1),
          };
        })}
      />
      <Divider />
      <Debug
        title={"评论设置"}
        records={data.policyOptions.map((value, index) => {
          return {
            label: "操作",
            value: value,
            action: "切换",
            onAction: () => store.modifyCommentPolicy(index + 1),
          };
        })}
      />
    </ScrollView>
  );
});
