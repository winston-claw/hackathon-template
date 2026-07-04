"use client";

import { Platform, View } from "react-native";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Text,
} from "@app-template/ui";
import { Screen } from "../components/screen";
import { APP_VERSION_NUMBER } from "../version/app-version";
import { openStoreListing } from "../version/store-links";

const STORE_NAME =
  Platform.OS === "ios" ? "the App Store" : "Google Play";

export function ForceUpgradeScreen() {
  return (
    <Screen className="flex-1 bg-background-50">
      <Box className="flex-1 justify-center px-6 gap-6">
        <View>
          <Text className="text-xs uppercase tracking-wider text-primary-600 font-semibold mb-2">
            Update required
          </Text>
          <Heading size="2xl" className="mb-3">
            Time to update
          </Heading>
          <Text className="text-typography-500 text-base">
            This version is no longer supported. Update from {STORE_NAME} to continue.
          </Text>
        </View>
        <Button action="primary" size="lg" onPress={openStoreListing}>
          <ButtonText>Update app</ButtonText>
        </Button>
        <Text className="text-typography-400 text-sm">
          Installed v{APP_VERSION_NUMBER}
        </Text>
      </Box>
    </Screen>
  );
}
