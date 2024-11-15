import ReactNativeToast from "react-native-toast-message";

export const ToastMessageElement = () => {
  return <ReactNativeToast />;
};

export class ToastMessage {
  static success(params: { title?: string; content?: string }) {
    const { title, content } = params;
    ReactNativeToast.show({ type: "success", position: "bottom", bottomOffset: 120, text1: title, text2: content });
  }

  static error(params: { title?: string; content?: string }) {
    const { title, content } = params;
    ReactNativeToast.show({ type: "error", position: "bottom", bottomOffset: 120, text1: title, text2: content });
  }

  static info(params: { title?: string; content?: string }) {
    const { title, content } = params;
    ReactNativeToast.show({ type: "info", position: "bottom", bottomOffset: 120, text1: title, text2: content });
  }
}
