import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { CurvedBottomTabs } from "@/components/base/curved-bottom-tabs";
import { useTabBarVisibility } from "@/contexts/tabbar-visibility-context";

export default function TabsLayout() {
  const { hideTabBar } = useTabBarVisibility();

  return (
    <Tabs
      tabBar={(props) =>
        hideTabBar ? null : (
          <CurvedBottomTabs
            {...props}
            gradients={["#12121a", "#1a1a24"]}
            floatingButtonGradient={["#1e1e28", "#282832"]}
          />
        )
      }
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <SymbolView name="house.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="champions"
        options={{
          title: "Champions",
          tabBarLabel: "Champions",
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.3.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color }) => (
            <SymbolView name="heart.fill" size={24} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <SymbolView name="gearshape.fill" size={24} tintColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
