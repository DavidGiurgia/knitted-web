import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        size="sm"
        aria-label="Toggle Theme"
      />
    </div>
  );
}
