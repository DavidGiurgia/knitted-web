import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";

export function ThemeSwitcher({size = "sm"}) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        size={size}
        aria-label="Toggle Theme"
      />
    </div>
  );
}
