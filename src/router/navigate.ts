import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";
import * as qs from "qs";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: any, params: any = {}) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}

export function navigateRedirect(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name, params }],
      })
    );
  }
}

export function navigateBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function navigateSchema(href: string) {
  const query = qs.parse(href.split("?")[1] || "");
  const { page, ...params } = query;
  navigate(page, params);
}
