import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useSetNavigationTitle } from "../../hooks/use-set-navigation-title";
import { EditorItem } from "../../../sdk/editor/editor";
import { useStore } from "./index.store";
import React from "react";

export const Editor = observer(() => {
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useSetNavigationTitle(data.title);

  initAndResetStore();

  return <EditorItem />;
});
