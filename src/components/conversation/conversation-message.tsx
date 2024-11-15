import { Debug } from "../debug/debug";

export const ConversationMessageItem = ({ message }) => {
  return (
    <Debug
      title={"会话信息详情"}
      records={[
        {
          label: "cmid",
          value: message.cmid,
          action: "打印",
          onAction: () => console.log(message),
        },
        {
          label: "昵称",
          value: message.user.nickname,
        },
        {
          label: "type",
          value: message.type,
        },
        {
          label: "message",
          value: message.content,
        },
      ]}
    />
  );
};
