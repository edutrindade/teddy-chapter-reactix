import React, { forwardRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import BottomSheet, { type BottomSheetMethods } from "@/components/templates/bottom-sheet";
import { Checkbox } from "@/components/organisms/check-box";
import { ROLE_FILTERS, type RoleFilter } from "@/types/champion";
import { Colors } from "@/theme/colors";

export interface FilterState {
  roles: Set<RoleFilter>;
  difficulty: boolean;
}

interface FiltersBottomSheetProps {
  filterState: FilterState;
  onRolesChange: (roles: Set<RoleFilter>) => void;
  onDifficultyChange: (v: boolean) => void;
  onApply: () => void;
  onClose?: () => void;
}

export const FiltersBottomSheet = forwardRef<BottomSheetMethods, FiltersBottomSheetProps>(
  function FiltersBottomSheet(
    { filterState, onRolesChange, onDifficultyChange, onApply, onClose },
    ref
  ) {
    const toggleRole = (role: RoleFilter) => {
      const next = new Set(filterState.roles);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      onRolesChange(next);
    };

    return (
      <BottomSheet
        ref={ref}
        snapPoints={["55%"]}
        backgroundColor={Colors.surfaceElevated}
        enableBackdrop
        dismissOnBackdropPress
        showHandle
        onClose={onClose}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Filters</Text>

          <Text style={styles.label}>Role</Text>
          <View style={styles.rolesRow}>
            {ROLE_FILTERS.map((role) => (
              <Pressable
                key={role}
                onPress={() => toggleRole(role)}
                style={styles.checkRow}
              >
                <View style={styles.checkboxBox}>
                  <Checkbox
                    checked={filterState.roles.has(role)}
                    checkmarkColor={Colors.primary}
                    size={28}
                    showBorder
                  />
                </View>
                <Text style={styles.checkLabel}>{role}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Difficulty (hard only)</Text>
          <Pressable
            onPress={() => onDifficultyChange(!filterState.difficulty)}
            style={styles.checkRow}
          >
            <View style={styles.checkboxBox}>
              <Checkbox
                checked={filterState.difficulty}
                checkmarkColor={Colors.primary}
                size={28}
                showBorder
              />
            </View>
            <Text style={styles.checkLabel}>Show high difficulty only</Text>
          </Pressable>

          <Pressable onPress={onApply} style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
          </Pressable>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  rolesRow: {
    gap: 12,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  checkboxBox: {
    backgroundColor: "#22222e",
    padding: 6,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  checkLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  applyButton: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
});
