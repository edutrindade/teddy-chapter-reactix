import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { TabBarVisibilityProvider } from "@/contexts/tabbar-visibility-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <FavoritesProvider>
        <TabBarVisibilityProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </TabBarVisibilityProvider>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0b" },
});
