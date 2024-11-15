import React from "react";
import { TouchableOpacity } from "react-native";
import RenderHtml from "react-native-render-html";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";

interface Props {
  notification: any;
  records?: DebugItem[];
}

export const NotificationItem: React.FC<Props> = ({ notification, records = [] }) => {
  return (
    <TouchableOpacity>
      <Debug
        title={"消息信息"}
        records={[
          {
            label: "nmid",
            value: notification.nmid,
            action: "打印",
            onAction: () => console.log(notification),
          },
          {
            label: "昵称",
            value: notification.actionUser?.nickname,
          },
          {
            label: "内容",
            value: <RenderHtml contentWidth={rpx(500)} source={{ html: `${notification.actionInfo?.content}` }} />,
          },
          {
            label: "时间",
            value: notification.timeAgo,
          },
        ].concat(records as any)}
      />
    </TouchableOpacity>
  );
};
