import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: (args: any) => args && args,
});

interface Props {
  children: React.ReactNode;
}

const CustomThemeProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggleColorMode = useCallback(() => {
    const docKeys = Array.from(
      document.getElementsByClassName(
        "object-key"
      ) as HTMLCollectionOf<HTMLElement>
    );
    const docSizes = Array.from(
      document.getElementsByClassName(
        "object-size"
      ) as HTMLCollectionOf<HTMLElement>
    );
    if (mode === "light") {
      for (let i = 0; i < docKeys.length; i++) {
        docKeys[i].style.color = "rgb(255, 255, 255)";
      }
      for (let i = 0; i < docSizes.length; i++) {
        docSizes[i].style.color = "rgba(255, 255, 255, 0.3)";
      }
    } else {
      for (let i = 0; i < docKeys.length; i++) {
        docKeys[i].style.color = "rgb(0, 43, 54)";
      }
      for (let i = 0; i < docSizes.length; i++) {
        docSizes[i].style.color = "rgba(0, 0, 0, 0.3)";
      }
    }
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const value = useMemo(
    () => ({ toggleColorMode, mode }),
    [toggleColorMode, mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useCustomThemeProvider = () => {
  const value = useContext(ColorModeContext);
  return useMemo(() => value, [value]);
};

export default CustomThemeProvider;
