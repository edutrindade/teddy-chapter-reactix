import React, { memo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Champion } from "@/types/champion";
import { getChampionSplash } from "@/services/champions";
import { Colors } from "@/theme/colors";

interface ChampionCardProps {
  champion: Champion;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const ChampionCard = memo(function ChampionCard({
  champion,
  onPress,
  onFavoritePress,
  isFavorite,
}: ChampionCardProps) {
  const splashUri = getChampionSplash(champion.id, 0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [champion.id]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {!imageLoaded && <View style={styles.imagePlaceholder} />}
      <Image
        key={champion.id}
        source={{ uri: splashUri }}
        style={[styles.image, !imageLoaded && styles.imageLoading]}
        resizeMode="cover"
        onLoad={() => setImageLoaded(true)}
      />
      {onFavoritePress != null && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
          style={styles.favButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#e84057" : Colors.textSecondary}
          />
        </Pressable>
      )}
      <View style={styles.overlay} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {champion.name}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {champion.title}
        </Text>
        <View style={styles.tagsRow}>
          {champion.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 0.7,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  cardPressed: { opacity: 0.9 },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.surfaceElevated,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  imageLoading: {
    opacity: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  info: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  title: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  tag: {
    backgroundColor: "rgba(200,155,60,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: "600",
  },
  favButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
