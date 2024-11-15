import { observer } from "mobx-react";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { rpx } from "../../../sdk/helpers/rpx";
import { Debug, DebugItem } from "../debug/debug";
import { GeotagInterception } from "./sections/interaction";

interface Props {
  geotag: any;
  interaction?: boolean;
  records?: DebugItem[];
}

export const GeotagItem: React.FC<Props> = observer((props) => {
  const { geotag, interaction = true, records = [] } = props;

  return (
    <TouchableOpacity>
      <Debug
        title={"地理信息"}
        records={[
          {
            label: "gtid",
            value: geotag.gtid,
            action: "打印",
            onAction: () => {
              console.log(geotag);
            },
          },
          {
            label: "名称",
            value: geotag.name,
          },
          {
            label: "封面图",
            value: <Image style={{ width: rpx(60), height: rpx(60) }} source={{ uri: geotag.cover }} />,
          },
          {
            label: "描述",
            value: geotag.description,
          },
          {
            label: "帖子数量",
            value: geotag.postCount,
          },
        ].concat(records as any)}
      />
      {interaction && <GeotagInterception geotag={geotag} />}
    </TouchableOpacity>
  );
});
