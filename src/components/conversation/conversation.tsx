import { navigate } from "../../router/navigate";
import { ScreenName } from "../../router/screen-name";
import { Debug } from "../debug/debug";

export const ConversationItem = ({ conversation, records = [] }) => {
  return (
    <Debug
      title={"会话详情"}
      records={[
        {
          label: "fsid",
          value: conversation.user.fsid,
          action: "打印",
          onAction: () => console.log(conversation),
        },
        {
          label: "uid",
          value: conversation.user.uid,
          action: "对话详情",
          onAction: () => {
            navigate(ScreenName.ConversationsMessages, { fsid: conversation.user.fsid });
          },
        },
        {
          label: "昵称",
          value: conversation.user.nickname,
        },
        {
          label: "cmid",
          value: conversation.latestMessage?.cmid,
        },
        {
          label: "type",
          value: conversation.latestMessage?.type,
        },
        {
          label: "message",
          value: conversation.latestMessage?.message,
        },
      ].concat(records as any)}
    />
  );
};
