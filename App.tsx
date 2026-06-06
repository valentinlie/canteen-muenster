import "./global.css";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MenuScreen } from "@/screens/MenuScreen";
import { PriceCategoryProvider } from "@/settings/priceCategory";
import { ThemeProvider } from "@/theme/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PriceCategoryProvider>
          {/* Header is dark/coloured in both schemes, so light status-bar
              content works for light and dark mode alike. */}
          <StatusBar style="light" />
          <MenuScreen />
        </PriceCategoryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
