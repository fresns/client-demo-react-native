import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { isLogicEmpty } from "../../sdk/utilities/toolkit";

export function useSetNavigationTitle(title: string) {
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLogicEmpty(title)) {
      navigation.setOptions({ title });
    }
  }, [title]);
}
