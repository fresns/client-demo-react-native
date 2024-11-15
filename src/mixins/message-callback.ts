import { isNil } from "lodash";
import { EApiCode } from "../../sdk/api";
import { Cache } from "../../sdk/helpers/cache";
import { fresnsApi } from "../../sdk/services/api";
import { ToastMessage } from "../components/message/toast-message";
import { navigateBack, navigateRedirect } from "../router/navigate";
import { ScreenName } from "../router/screen-name";

class MessageCallback {
  async handleMessage() {
    const callbackMessage = await Cache.get<any>("fresnsCallbackMessage");
    console.log("start handleMessage:", callbackMessage);

    if (isNil(callbackMessage)) {
      return;
    }

    if (callbackMessage.code !== 0) {
      ToastMessage.error({
        title: "Message Callback 处理失败",
        content: "[" + callbackMessage.code + "] " + callbackMessage.message,
      });

      await Cache.delete("fresnsCallbackMessage");
      return;
    }

    const data = callbackMessage.data;

    // 针对多种 callbackMessage 添加处理逻辑
    switch (callbackMessage.action.postMessageKey) {
      case "fresnsAccountSign": {
        const res = await fresnsApi.account.login({ loginToken: data.loginToken });
        if (res.code === EApiCode.Success) {
          const { data } = res;
          await Cache.put("aid", data.authToken.aid);
          await Cache.put("aidToken", data.authToken.aidToken);
          await Cache.put("uid", data.authToken.uid);
          await Cache.put("uidToken", data.authToken.uidToken);
          await Cache.put("fresnsAccountData", data);

          const detailRes = await fresnsApi.user.detail(data.authToken.uid);
          if (detailRes.code === EApiCode.Success) {
            await Cache.put("fresnsUserData", detailRes.data, 5);
          }
          navigateBack();
        } else {
          ToastMessage.error({
            title: `[${res.code}] ${res.message}`,
          });
        }
        break;
      }
      default:
        break;
    }

    if (callbackMessage.action.windowClose) {
      navigateBack();
    }

    if (callbackMessage.action.redirectUrl) {
      // 此处需根据 ScreenName 定义来自定义消息体来实现跳转以及参数
      // 以下为跳转 `Portal` 示例
      navigateRedirect(ScreenName.Portal, {});
    }

    console.log(`handleMessage success`);
    await Cache.delete("fresnsCallbackMessage");
  }

  async postMessage(message: any) {
    await Cache.put("fresnsCallbackMessage", message);
    await this.handleMessage();
  }
}

export const messageCallback = new MessageCallback();
