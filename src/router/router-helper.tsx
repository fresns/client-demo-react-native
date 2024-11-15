import { TypedNavigator } from "@react-navigation/native";
import React from "react";

export type StackItem = {
  name: string;
  stack: React.ComponentType<any>;
  screens: ScreenItem[];
};

export type ScreenItem = {
  name: string;
  title: string;
  initialParams?: Record<string, string>;
  screen: React.ComponentType<any>;
};

export function renderStackNavigator(Stack: TypedNavigator<any, any, any, any, any>, screens: ScreenItem[]) {
  return (
    <Stack.Navigator>
      {screens.map((screen) => {
        return (
          <Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.screen}
            options={{ title: screen.title }}
            initialParams={screen.initialParams}
          />
        );
      })}
    </Stack.Navigator>
  );
}
