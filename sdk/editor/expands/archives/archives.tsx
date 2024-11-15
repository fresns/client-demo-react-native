/*
 * Fresns (https://fresns.org)
 * Copyright (C) 2021-Present Jevan Tang
 * Released under the Apache-2.0 License.
 */

import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Debug } from "../../../../components/debug/debug"; // Jevan Note: component
import { useStore } from "./archives.store";

interface Props {
  type: string;
  did: string;
  archives: any[];
  archiveGroupConfigs: any[];
}

export const EditorArchives: React.FC<Props> = observer((props) => {
  const { store, initAndResetStore } = useStore();

  useEffect(() => {
    store.props = props;
  }, [props]);

  initAndResetStore();

  return (
    <>
      {/*<Debug*/}
      {/*  title={"Archives Info"}*/}
      {/*  records={[*/}
      {/*    {*/}
      {/*      label: "Print",*/}
      {/*      value: "Print archives",*/}
      {/*      action: "Print",*/}
      {/*      onAction: () => console.log(props.archives),*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: "Print",*/}
      {/*      value: "Print archiveGroupConfigs",*/}
      {/*      action: "Print",*/}
      {/*      onAction: () => console.log(props.archiveGroupConfigs),*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
    </>
  );
});
