import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSwitchStore } from "./switch.store";

interface Props {
  user: any;
}

export const UserSwitchItem: React.FC<Props> = observer((props) => {
  const { user } = props;
  const { store, initAndResetStore } = useSwitchStore();
  const data = toJS(store.data);

  useEffect(() => {
    store.handleProps(props);
  }, [props]);
  initAndResetStore();

  if (data.isPending) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row" }}>
      {data.postEnabled && (
        <TouchableOpacity onPress={store.onClickToPosts} style={{ flex: 1 }}>
          <Text>{data.postName}</Text>
        </TouchableOpacity>
      )}
      {data.commentEnabled && (
        <TouchableOpacity onPress={store.onClickToComments} style={{ flex: 1 }}>
          <Text>{data.commentName}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => store.onClickMenus("likes")} style={{ flex: 1 }}>
        <Text>{user.interaction.likeName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => store.onClickMenus("dislikes")} style={{ flex: 1 }}>
        <Text>{user.interaction.dislikeName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => store.onClickMenus("following")} style={{ flex: 1 }}>
        <Text>{user.interaction.followName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => store.onClickMenus("blocking")} style={{ flex: 1 }}>
        <Text>{user.interaction.blockName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => store.onClickMenus("interactions")} style={{ flex: 1 }}>
        <Text>{data.fresnsLang.more}</Text>
      </TouchableOpacity>
    </View>
  );
});
