import { Redirect } from "expo-router";

export default function Index() {
  // @ts-expect-error expo-router typed routes
  return <Redirect href="/(tabs)" />;
}
