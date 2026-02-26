import { ScaleCarousel } from "@/components/molecules/scale-carousel";
import AnimatedHeaderScrollView from "@/components/organisms/animated-header-scrollview";
import { FadeText } from "@/components/organisms/fade-text";
import BottomSheet, { type BottomSheetMethods } from "@/components/templates/bottom-sheet";
import { useFavorites } from "@/contexts/favorites-context";
import { useTabBarVisibility } from "@/contexts/tabbar-visibility-context";
import {
  getChampionById,
  getChampionSkins,
  getChampionSplash,
} from "@/services/champions";
import { Colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SKIN_CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.35;

interface SkinCarouselItem {
  image: ImageSourcePropType;
  skinName: string;
}

export default function ChampionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const statsSheetRef = useRef<BottomSheetMethods>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setHideTabBar } = useTabBarVisibility();

  const champion = useMemo(
    () => (id ? getChampionById(id) : undefined),
    [id]
  );

  const skins = useMemo(
    () => (champion ? getChampionSkins(champion.id, 5) : []),
    [champion]
  );

  const skinCarouselData: SkinCarouselItem[] = useMemo(
    () =>
      skins.map((s) => ({
        image: { uri: s.splashUrl },
        skinName: s.name,
      })),
    [skins]
  );

  React.useEffect(() => {
    if (id != null && champion == null) {
      router.replace("/champions" as never);
    }
  }, [id, champion, router]);

  const openStats = () => {
    setHideTabBar(true);
    statsSheetRef.current?.expand?.();
  };
  const closeStats = () => statsSheetRef.current?.close?.();
  const handleStatsSheetClose = () => setHideTabBar(false);

  if (!champion) {
    return null;
  }

  const splashUri = getChampionSplash(champion.id, 0);
  const fav = isFavorite(champion.id);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Pressable
        onPress={() => router.back()}
        style={[styles.backButtonOverlay, { top: insets.top + 8 }]}
        hitSlop={12}
      >
        <Ionicons name="chevron-back" size={26} color={Colors.text} />
      </Pressable>
      <AnimatedHeaderScrollView
        largeTitle={champion.name}
        subtitle={champion.title}
        headerBackgroundGradient={{
          colors: ["rgba(10,10,11,0.9)", "rgba(18,18,26,0.85)", "transparent"],
          start: { x: 0.5, y: 0 },
          end: { x: 0.5, y: 1 },
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        largeTitleContainerStyle={{ paddingLeft: 60 }}
      >
        <View style={styles.splashWrap}>
          <Image
            source={{ uri: splashUri }}
            style={styles.splashImage}
            resizeMode="cover"
          />
          <View style={styles.splashOverlay} />
        </View>

        <View style={styles.loreSection}>
          <Text style={styles.sectionLabel}>Lore</Text>
          <FadeText
            inputs={[champion.blurb]}
            wordDelay={30}
            duration={400}
            fontSize={15}
            color={Colors.textSecondary}
            textAlign="left"
          />
        </View>

        <View style={styles.skinsSection}>
          <Text style={styles.sectionLabel}>Skins</Text>
          <View style={{ height: SKIN_CAROUSEL_HEIGHT }}>
            <ScaleCarousel<SkinCarouselItem>
              data={skinCarouselData}
              itemWidth={SCREEN_WIDTH * 0.6}
              itemHeight={SKIN_CAROUSEL_HEIGHT - 24}
              spacing={12}
              scaleRange={[1.15, 1, 1.15]}
              rotationRange={[5, 0, -5]}
              renderItem={({ item }) => (
                <View style={styles.skinCard}>
                  <View style={styles.skinNameWrap}>
                    <Text style={styles.skinName} numberOfLines={1}>
                      {item.skinName}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => toggleFavorite(champion.id)}
            style={[styles.actionBtn, fav && styles.actionBtnActive]}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={22}
              color={fav ? "#e84057" : Colors.text}
            />
            <Text style={[styles.actionBtnText, fav && styles.actionBtnTextActive]}>
              {fav ? "Favorited" : "Favorite"}
            </Text>
          </Pressable>
          <Pressable onPress={openStats} style={styles.actionBtnPrimary}>
            <Ionicons name="stats-chart" size={22} color={Colors.black} />
            <Text style={styles.actionBtnTextPrimary}>View Stats</Text>
          </Pressable>
        </View>
      </AnimatedHeaderScrollView>

      <BottomSheet
        ref={statsSheetRef}
        snapPoints={["45%"]}
        backgroundColor={Colors.surfaceElevated}
        enableBackdrop
        dismissOnBackdropPress
        showHandle
        onClose={handleStatsSheetClose}
      >
        <View style={styles.statsContent}>
          <Text style={styles.statsTitle}>{champion.name} — Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>HP</Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${Math.min(100, (champion.stats.hp / 700) * 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{champion.stats.hp}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Attack</Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${(champion.info.attack / 10) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{champion.info.attack}/10</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Defense</Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${(champion.info.defense / 10) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{champion.info.defense}/10</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Difficulty</Text>
            <View style={styles.statBarBg}>
              <View
                style={[
                  styles.statBarFill,
                  { width: `${(champion.info.difficulty / 10) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.statValue}>{champion.info.difficulty}/10</Text>
          </View>
          <Pressable onPress={closeStats} style={styles.closeStatsBtn}>
            <Text style={styles.closeStatsText}>Close</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonOverlay: {
    position: "absolute",
    left: 8,
    marginTop: 18,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  splashWrap: {
    width: SCREEN_WIDTH,
    marginHorizontal: -16,
    height: 220,
    marginBottom: 24,
    overflow: "hidden",
  },
  splashImage: {
    width: "100%",
    height: "100%",
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  loreSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  skinsSection: {
    marginBottom: 24,
  },
  skinCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  skinNameWrap: {
    minHeight: 22,
    justifyContent: "center",
  },
  skinName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnActive: {
    backgroundColor: "rgba(232,64,87,0.3)",
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  actionBtnTextActive: {
    color: "#e84057",
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBtnTextPrimary: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  statsContent: {
    padding: 24,
    paddingBottom: 40,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  statLabel: {
    width: 72,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  statValue: {
    width: 44,
    fontSize: 12,
    color: Colors.text,
    fontWeight: "600",
  },
  closeStatsBtn: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeStatsText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
});
