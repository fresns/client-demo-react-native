/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React from "react";
import { Image } from "react-native";
import { Debug } from "../../../../src/components/debug/debug"; // Jevan Note: component

interface Props {
  type: string;
  did: string;
  infos: any[];
}

export const EditorInfoBox: React.FC<Props> = observer((props) => {
  return (
    <>
      {props.infos.map((info) => {
        return (
          <Debug
            title={"Editor Info"}
            records={[
              info.image && {
                label: "Image",
                value: <Image source={{ uri: info.image }} />,
                action: "Print",
                onAction: () => console.log(info),
              },
              info.title && {
                label: "Title",
                value: info.title,
              },
            ].filter((v) => !!v)}
          />
        );
      })}
    </>
  );
});
