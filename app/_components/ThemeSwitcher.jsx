"use client";

import { Switch } from "@nextui-org/react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div className="">
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        size="sm"
        aria-label="Toggle Theme"
      />
    </div>
  );
};
