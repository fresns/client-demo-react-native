/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React from "react";
import Markdown from "react-native-markdown-display";
import RenderHtml from "react-native-render-html";
import { Debug } from "../../../../src/components/debug/debug"; // Jevan Note: component

interface Props {
  type: string;
  did: string;
  texts: any[];
}

export const EditorTextBox: React.FC<Props> = observer((props) => {
  return (
    <>
      {props.texts.map((text) => {
        return (
          <Debug
            title={"Editor Text"}
            records={[
              {
                label: "Content",
                value: text.isMarkdown ? (
                  <Markdown>{text.content}</Markdown>
                ) : (
                  <RenderHtml source={{ html: text.content }} />
                ),
                action: "Print",Print
                onAction: () => console.log(text),
              },
            ]}
          />
        );
      })}
    </>
  );
});
