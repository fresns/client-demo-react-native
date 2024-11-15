import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { GroupInteraction } from "./sections/interaction";

interface Props {
  group: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const GroupItem: React.FC<Props> = observer((props) => {
  const { group, interaction = true, records = [] } = props;

  return (
    <TouchableOpacity>
      <Debug
        title={"群组信息"}
        records={[
          {
            label: "gid",
            value: group.gid,
            action: "打印",
            onAction: () => console.log(group),
          },
          {
            label: "名称",
            value: group.name,
          },
          {
            label: "描述",
            value: group.description,
          },
          {
            label: "图片",
            value: <Image style={{ width: rpx(60), height: rpx(60) }} source={{ uri: group.cover }} />,
          },
        ].concat(records as any)}
      />
      {interaction && <GroupInteraction group={group} />}
    </TouchableOpacity>
  );
});
