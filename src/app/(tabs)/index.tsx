import { Aurora } from "@/components/molecules/aurora";
import { ScaleCarousel } from "@/components/molecules/scale-carousel";
import { ShimmerEffect } from "@/components/molecules/Shimmer/Shimmer";
import AnimatedHeaderScrollView from "@/components/organisms/animated-header-scrollview";
import { FadeText } from "@/components/organisms/fade-text";
import {
  getChampionSplash,
  getFreeRotationChampions,
} from "@/services/champions";
import { Colors } from "@/theme/colors";
import type { Champion } from "@/types/champion";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.5;

interface CarouselChampionItem {
  image: ImageSourcePropType;
  champion: Champion;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const freeChampions = useMemo(() => getFreeRotationChampions(6), []);

  const carouselData: CarouselChampionItem[] = useMemo(
    () =>
      freeChampions.map((c) => ({
        image: { uri: getChampionSplash(c.id, 0) },
        champion: c,
      })),
    [freeChampions]
  );

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ShimmerEffect isLoading preset="dark" style={styles.shimmer}>
          <View style={styles.shimmerPlaceholder} />
        </ShimmerEffect>
      </View>
    );
  }

  return (
    <AnimatedHeaderScrollView
      largeTitle="League Companion"
      subtitle="Created by Eduardo Trindade"
      headerBackgroundGradient={{
        colors: ["rgba(10,10,11,0.95)", "rgba(18,18,26,0.9)", "transparent"],
        start: { x: 0.5, y: 0 },
        end: { x: 0.5, y: 1 },
      }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      <View style={[styles.auroraWrap, { marginHorizontal: -16 }]}>
        <Aurora
          width={SCREEN_WIDTH}
          height={140}
          auroraColors={[Colors.primary, "#0a0a0b", Colors.primaryDim]}
          skyColors={["#0a0a0b", "#12121a"]}
          speed={0.3}
          intensity={0.8}
        />
      </View>

      <View style={styles.carouselSection}>
        <Text style={styles.sectionTitle}>Free Rotation</Text>
        <View style={{ height: CAROUSEL_HEIGHT }}>
          <ScaleCarousel<CarouselChampionItem>
            data={carouselData}
            itemWidth={SCREEN_WIDTH * 0.75}
            itemHeight={CAROUSEL_HEIGHT - 40}
            spacing={16}
            scaleRange={[1.2, 1, 1.2]}
            rotationRange={[8, 0, -8]}
            renderItem={({ item }) => (
              <View style={styles.carouselCard}>
                <View style={styles.carouselCardInfo}>
                  <Text style={styles.carouselName}>{item.champion.name}</Text>
                  <Text style={styles.carouselTitle}>{item.champion.title}</Text>
                  <View style={styles.tagsRow}>
                    {item.champion.tags.slice(0, 2).map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.quoteSection}>
        <FadeText
          inputs={[
            "Welcome to the Rift.",
            "Champions await.",
            "League Companion — Reactix.",
          ]}
          wordDelay={200}
          duration={600}
          fontSize={20}
          color={Colors.textSecondary}
          textAlign="center"
        />
      </View>
    </AnimatedHeaderScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  shimmer: {
    width: "90%",
    height: 200,
    borderRadius: 16,
  },
  shimmerPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  auroraWrap: {
    height: 140,
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: 24,
  },
  carouselSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  carouselCard: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  carouselCardInfo: {
    gap: 4,
  },
  carouselName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
  },
  carouselTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: "rgba(200,155,60,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  quoteSection: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
});
