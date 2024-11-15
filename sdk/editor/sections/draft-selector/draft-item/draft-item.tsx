/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Debug, DebugItem } from "../../../../../components/debug/debug"; // Jevan Note: component

interface Props {
  draft: any;
  records?: DebugItem[];
}

export const DraftItem: React.FC<Props> = observer((props) => {
  const { draft, records = [] } = props;

  return (
    <TouchableOpacity>
      <Debug
        title={"Draft"}
        records={[
          {
            label: "did",
            value: draft.did,
            action: "Print",
            onAction: () => {
              console.log(draft);
            },
          },
        ].concat(records as any)}
      />
    </TouchableOpacity>
  );
});
