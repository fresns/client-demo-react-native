/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../../../src/components/debug/debug"; // Jevan Note: component
import { useStore } from "./read-config.store";

interface Props {
  type: string;
  did: string;
  readConfig: any;
}

export const EditorReadConfig: React.FC<Props> = observer((props) => {
  const { readConfig } = props;
  const { store, initAndResetStore } = useStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  // Jevan Note: multilingualism in text
  return (
    <Debug
      title={"Read Config"}
      records={[
        {
          label: "Operation",
          value: "Edit",
          action: "Edit",
          onAction: () => store.onClickModify(),
        },
        {
          label: "Info",
          value: "Print whitelist",
          action: "Print",
          onAction: () => console.log(readConfig.whitelist),
        },
      ]}
    />
  );
});
