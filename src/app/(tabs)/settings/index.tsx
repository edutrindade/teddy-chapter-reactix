import React, { useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AnimatedScrollProgress } from "@/components/micro-interactions/animated-scroll-progress";
import { Checkbox } from "@/components/organisms/check-box";
import { Dialog, useDialogContext } from "@/components/organisms/dialog";
import BottomSheet, { type BottomSheetMethods } from "@/components/templates/bottom-sheet";
import { Colors } from "@/theme/colors";

const TERMS_LONG =
  "Terms and Conditions\n\n" +
  "1. This is a demo application showcasing Reactix components for League of Legends Companion.\n\n" +
  "2. All champion data and assets are used for demonstration purposes only.\n\n" +
  "3. League of Legends and Riot Games are trademarks of Riot Games, Inc.\n\n" +
  "4. This app is built with Expo, React Native, Reanimated, and Reactix.\n\n" +
  "5. By using this app you agree to the terms set forth in this document.\n\n" +
  "6. The developer assumes no liability for any use of this application.\n\n" +
  "7. Scroll to the end to enable the agreement checkbox.\n\n".repeat(3);

function TermsDialogOpener({ when }: { when: boolean }) {
  const { setIsOpen } = useDialogContext();
  React.useEffect(() => {
    if (when) setIsOpen(true);
  }, [when, setIsOpen]);
  return null;
}

function TermsDialogContent({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { closeDialog } = useDialogContext();
  return (
    <View style={styles.dialogContent}>
      <Text style={styles.dialogTitle}>Do you accept the terms?</Text>
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

export default function SettingsScreen() {
  const aboutSheetRef = useRef<BottomSheetMethods>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handleEndReached = useCallback(() => {
    setAgreed(true);
  }, []);

  const handleEndReset = useCallback(() => {
    setAgreed(false);
  }, []);

  const handleScrollProgressChange = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const openAbout = () => aboutSheetRef.current?.expand?.();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, scrollProgress)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            Scroll progress: {Math.round(scrollProgress)}%
          </Text>
        </View>

        <AnimatedScrollProgress
          renderInitialContent={() => (
            <Text style={styles.fabText}>Scroll to read terms</Text>
          )}
          renderEndContent={() => (
            <Text style={styles.fabText}>Read complete</Text>
          )}
          endReachedThreshold={98}
          endResetThreshold={90}
          onEndReached={handleEndReached}
          onEndReset={handleEndReset}
          onScrollProgressChange={handleScrollProgressChange}
          showFabOnScroll={true}
          fabAppearScrollOffset={80}
          fabBackgroundColor={Colors.surfaceElevated}
          fabEndBackgroundColor={Colors.primary}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          <Text style={styles.termsTitle}>Terms and Conditions</Text>
          <Text style={styles.termsBody}>{TERMS_LONG}</Text>

          <View style={styles.agreeSection}>
            <Pressable
              onPress={() => agreed && setShowTermsDialog(true)}
              disabled={!agreed}
              style={[styles.checkRow, !agreed && styles.checkRowDisabled]}
            >
              <Checkbox
                checked={termsAccepted}
                checkmarkColor={Colors.primary}
                size={24}
              />
              <Text style={styles.checkLabel}>I agree to the terms</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowTermsDialog(true)}
              disabled={!agreed}
              style={[styles.continueBtn, !agreed && styles.continueBtnDisabled]}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </Pressable>
          </View>

          <View style={styles.aboutSection}>
            <Pressable onPress={openAbout} style={styles.aboutBtn}>
              <Text style={styles.aboutBtnText}>About this app</Text>
            </Pressable>
          </View>
        </AnimatedScrollProgress>
      </View>

      <Dialog>
        <TermsDialogOpener when={showTermsDialog} />
        <Dialog.Content onClose={() => setShowTermsDialog(false)}>
          <TermsDialogContent
            onConfirm={() => {
              setTermsAccepted(true);
              setShowTermsDialog(false);
            }}
            onCancel={() => setShowTermsDialog(false)}
          />
        </Dialog.Content>
      </Dialog>

      <BottomSheet
        ref={aboutSheetRef}
        snapPoints={["40%"]}
        backgroundColor={Colors.surfaceElevated}
        enableBackdrop
        dismissOnBackdropPress
        showHandle
      >
        <View style={styles.aboutContent}>
          <Text style={styles.aboutTitle}>About this app</Text>
          <Text style={styles.aboutSubtitle}>
            League of Legends Reactix Companion
          </Text>
          <View style={styles.techList}>
            <Text style={styles.techItem}>• Expo</Text>
            <Text style={styles.techItem}>• React Native</Text>
            <Text style={styles.techItem}>• Reanimated</Text>
            <Text style={styles.techItem}>• Reactix</Text>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 56,
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.surface,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    flexGrow: 1,
  },
  termsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  termsBody: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  agreeSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  checkRowDisabled: {
    opacity: 0.5,
  },
  checkLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  continueBtnDisabled: {
    backgroundColor: Colors.surface,
    opacity: 0.7,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  aboutSection: {
    marginTop: 8,
  },
  aboutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
  },
  aboutBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  aboutContent: {
    padding: 24,
    paddingBottom: 40,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  aboutSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  techList: {
    gap: 12,
  },
  techItem: {
    fontSize: 16,
    color: Colors.text,
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
  fabText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
