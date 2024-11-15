import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { UserInteraction } from "./sections/interaction";

interface Props {
  user: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const UserItem: React.FC<Props> = observer((props) => {
  const { user, interaction = true, records = [] } = props;

  return (
    <TouchableOpacity>
      <Debug
        title="用户信息"
        records={[
          {
            label: "uid",
            value: user.uid,
            action: "打印",
            onAction: () => {
              console.log(user);
            },
          },
          {
            label: "昵称",
            value: user.nickname,
          },
          {
            label: "用户名",
            value: user.username,
          },
          {
            label: "头像",
            value: <Image style={{ width: rpx(60), height: rpx(60) }} source={{ uri: user.avatar }} />,
          },
        ].concat(records as any)}
      />
      {interaction && <UserInteraction user={user} />}
    </TouchableOpacity>
  );
});
