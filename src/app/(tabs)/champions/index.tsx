import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AnimatedHeaderScrollView from "@/components/organisms/animated-header-scrollview";
import { FadeText } from "@/components/organisms/fade-text";
import { ShimmerEffect } from "@/components/molecules/Shimmer/Shimmer";
import { Dialog, useDialogContext } from "@/components/organisms/dialog";
import { ChampionCard } from "@/features/champions/components/champion-card";
import { FiltersBottomSheet, type FilterState } from "@/features/champions/components/filters-bottom-sheet";
import type { BottomSheetMethods } from "@/components/templates/bottom-sheet";
import {
  getChampionsList,
} from "@/services/champions";
import type { Champion } from "@/types/champion";
import { ROLE_TO_TAGS, type RoleFilter } from "@/types/champion";
import { useFavorites } from "@/contexts/favorites-context";
import { useTabBarVisibility } from "@/contexts/tabbar-visibility-context";
import { Colors } from "@/theme/colors";

const NUM_COLUMNS = 2;

function filterChampions(
  list: Champion[],
  roles: Set<RoleFilter>,
  difficultyOnly: boolean
): Champion[] {
  let out = list;
  if (roles.size > 0) {
    const roleList = [...roles];
    out = out.filter((c) =>
      roleList.some((role) =>
        ROLE_TO_TAGS[role].some((tag) => c.tags.includes(tag))
      )
    );
  }
  if (difficultyOnly) {
    out = out.filter((c) => c.info.difficulty >= 6);
  }
  return out;
}

function FavoriteDialogOpener({ when }: { when: Champion | null }) {
  const { setIsOpen } = useDialogContext();
  React.useEffect(() => {
    if (when) setIsOpen(true);
  }, [when, setIsOpen]);
  return null;
}

function ChampionFavoriteDialogContent({
  pendingChampion,
  onConfirm,
  onCancel,
}: {
  pendingChampion: Champion | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { closeDialog } = useDialogContext();
  if (!pendingChampion) return null;
  return (
    <View style={styles.dialogContent}>
      <Text style={styles.dialogTitle}>
        Add {pendingChampion.name} to favorites?
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
            Confirm
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ChampionsScreen() {
  const router = useRouter();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { setHideTabBar } = useTabBarVisibility();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    roles: new Set(),
    difficulty: false,
  });
  const [pendingChampion, setPendingChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);

  const allChampions = useMemo(() => getChampionsList(), []);
  const champions = useMemo(
    () =>
      filterChampions(
        allChampions,
        filterState.roles,
        filterState.difficulty
      ),
    [allChampions, filterState]
  );

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const openFilters = useCallback(() => {
    setHideTabBar(true);
    sheetRef.current?.expand?.();
  }, [setHideTabBar]);

  const handleApplyFilters = useCallback(() => {
    sheetRef.current?.close?.();
  }, []);

  const handleFiltersClose = useCallback(() => {
    setHideTabBar(false);
  }, [setHideTabBar]);

  const handleChampionPress = useCallback(
    (champion: Champion) => {
      router.push(`/champions/${champion.id}` as never);
    },
    [router]
  );

  const handleFavoritePress = useCallback((champion: Champion) => {
    if (isFavorite(champion.id)) {
      toggleFavorite(champion.id);
      return;
    }
    setPendingChampion(champion);
  }, [isFavorite, toggleFavorite]);

  const confirmAddFavorite = useCallback(() => {
    if (pendingChampion) {
      toggleFavorite(pendingChampion.id);
      setPendingChampion(null);
    }
  }, [pendingChampion, toggleFavorite]);

  const renderItem = useCallback(
    ({ item }: { item: Champion }) => (
      <View style={styles.cardWrap}>
        <ChampionCard
          champion={item}
          onPress={() => handleChampionPress(item)}
          onFavoritePress={() => handleFavoritePress(item)}
          isFavorite={isFavorite(item.id)}
        />
      </View>
    ),
    [handleChampionPress, handleFavoritePress, isFavorite]
  );

  const keyExtractor = useCallback((item: Champion) => item.id, []);

  const clearFilters = useCallback(() => {
    setFilterState({ roles: new Set(), difficulty: false });
  }, []);

  const hasActiveFilters = filterState.roles.size > 0 || filterState.difficulty;
  const { height: windowHeight } = useWindowDimensions();

  const listEmptyComponent = useMemo(() => {
    if (!hasActiveFilters) return null;
    return (
      <View style={[styles.emptyState, { minHeight: Math.max(320, windowHeight * 0.5) }]}>
        <Text style={styles.emptyTitle}>Nenhum campeão encontrado</Text>
        <Text style={styles.emptySubtitle}>
          Tente outros filtros ou limpe para ver todos.
        </Text>
        <Pressable onPress={clearFilters} style={styles.emptyButton}>
          <Text style={styles.emptyButtonText}>Limpar filtros</Text>
        </Pressable>
      </View>
    );
  }, [hasActiveFilters, clearFilters, windowHeight]);

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
    <>
      <AnimatedHeaderScrollView
        largeTitle="Champions"
        subtitle={`${champions.length} champions`}
        rightComponent={
          <Pressable onPress={openFilters} style={styles.filterButton}>
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
        }
        headerBackgroundGradient={{
          colors: ["rgba(10,10,11,0.95)", "rgba(18,18,26,0.9)", "transparent"],
          start: { x: 0.5, y: 0 },
          end: { x: 0.5, y: 1 },
        }}
      >
        <View style={styles.subtitleAnimated}>
          <FadeText
            inputs={["Browse all champions. Tap to view details."]}
            wordDelay={80}
            duration={500}
            fontSize={14}
            color={Colors.textSecondary}
          />
        </View>

        <FlatList
          data={champions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          extraData={filterState}
          numColumns={NUM_COLUMNS}
          key="grid"
          scrollEnabled={false}
          contentContainerStyle={[
            styles.grid,
            champions.length === 0 && hasActiveFilters && styles.gridEmpty,
          ]}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={listEmptyComponent}
        />
      </AnimatedHeaderScrollView>

      <FiltersBottomSheet
        ref={sheetRef}
        filterState={filterState}
        onRolesChange={(roles) =>
          setFilterState((s) => ({ ...s, roles }))
        }
        onDifficultyChange={(difficulty) =>
          setFilterState((s) => ({ ...s, difficulty }))
        }
        onApply={handleApplyFilters}
        onClose={handleFiltersClose}
      />

      <Dialog>
        <FavoriteDialogOpener when={pendingChampion} />
        <Dialog.Content onClose={() => setPendingChampion(null)}>
          <ChampionFavoriteDialogContent
            pendingChampion={pendingChampion}
            onConfirm={confirmAddFavorite}
            onCancel={() => setPendingChampion(null)}
          />
        </Dialog.Content>
      </Dialog>
    </>
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
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  subtitleAnimated: {
    marginBottom: 20,
  },
  grid: {
    paddingBottom: 120,
  },
  gridEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  row: {
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
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
    backgroundColor: Colors.primary,
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
