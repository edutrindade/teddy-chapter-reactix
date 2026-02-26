import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FadeText } from "@/components/organisms/fade-text";
import { ShimmerEffect } from "@/components/molecules/Shimmer/Shimmer";
import { Dialog, useDialogContext } from "@/components/organisms/dialog";
import { ChampionCard } from "@/features/champions/components/champion-card";
import { getChampionById } from "@/services/champions";
import type { Champion } from "@/types/champion";
import { useFavorites } from "@/contexts/favorites-context";
import { Colors } from "@/theme/colors";

const NUM_COLUMNS = 2;

function RemoveFavoriteDialogOpener({ when }: { when: Champion | null }) {
  const { setIsOpen } = useDialogContext();
  React.useEffect(() => {
    if (when) setIsOpen(true);
  }, [when, setIsOpen]);
  return null;
}

function RemoveFavoriteDialogContent({
  champion,
  onConfirm,
  onCancel,
}: {
  champion: Champion | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { closeDialog } = useDialogContext();
  if (!champion) return null;
  return (
    <View style={styles.dialogContent}>
      <Text style={styles.dialogTitle}>
        Remove {champion.name} from favorites?
      </Text>
      <View style={styles.dialogButtons}>
        <Pressable
          onPress={() => {
            onCancel();
            closeDialog();
          }}
          style={styles.dialogButtonCancel}
        >
          <Text style={styles.dialogButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            onConfirm();
            closeDialog();
          }}
          style={styles.dialogButtonConfirm}
        >
          <Text style={[styles.dialogButtonText, { color: Colors.black }]}>
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const [pendingRemove, setPendingRemove] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);

  const favorites = useMemo(() => {
    const list: Champion[] = [];
    favoriteIds.forEach((id) => {
      const c = getChampionById(id);
      if (c) list.push(c);
    });
    return list;
  }, [favoriteIds]);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleChampionPress = useCallback(
    (champion: Champion) => {
      router.push(`/champions/${champion.id}` as never);
    },
    [router]
  );

  const handleRemovePress = useCallback((champion: Champion) => {
    setPendingRemove(champion);
  }, []);

  const confirmRemove = useCallback(() => {
    if (pendingRemove) {
      toggleFavorite(pendingRemove.id);
      setPendingRemove(null);
    }
  }, [pendingRemove, toggleFavorite]);

  const renderItem = useCallback(
    ({ item }: { item: Champion }) => (
      <View style={styles.cardWrap}>
        <ChampionCard
          champion={item}
          onPress={() => handleChampionPress(item)}
          onFavoritePress={() => handleRemovePress(item)}
          isFavorite={true}
        />
      </View>
    ),
    [handleChampionPress, handleRemovePress]
  );

  const keyExtractor = useCallback((item: Champion) => item.id, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ShimmerEffect isLoading preset="dark" style={styles.shimmer}>
          <View style={styles.shimmerPlaceholder} />
        </ShimmerEffect>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons
            name="heart-dislike-outline"
            size={64}
            color={Colors.textMuted}
          />
        </View>
        <FadeText
          inputs={[
            "You have no favorite champions yet.",
            "Tap the heart on any champion to add them here.",
          ]}
          wordDelay={60}
          duration={450}
          fontSize={17}
          color={Colors.textSecondary}
          textAlign="center"
          containerStyle={styles.emptyTextWrap}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <FadeText
            inputs={[`${favorites.length} champion${favorites.length === 1 ? "" : "s"}`]}
            wordDelay={50}
            duration={400}
            fontSize={14}
            color={Colors.textSecondary}
          />
        </View>
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          scrollEnabled={true}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      </View>

      <Dialog>
        <RemoveFavoriteDialogOpener when={pendingRemove} />
        <Dialog.Content onClose={() => setPendingRemove(null)}>
          <RemoveFavoriteDialogContent
            champion={pendingRemove}
            onConfirm={confirmRemove}
            onCancel={() => setPendingRemove(null)}
          />
        </Dialog.Content>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
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
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    marginBottom: 24,
    opacity: 0.85,
  },
  emptyTextWrap: {
    maxWidth: 280,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  grid: {
    paddingBottom: 120,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  cardWrap: {
    flex: 1,
    maxWidth: "48%",
  },
  dialogContent: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    padding: 24,
    minWidth: 280,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  dialogButtonCancel: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  dialogButtonConfirm: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
