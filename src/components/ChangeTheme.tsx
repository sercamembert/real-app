"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

interface Props {}

const ChangeTheme = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <div
      className="flex gap-3 items-center"
      onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme == "dark" ? (
        <Sun className="w-[20px] h-[20px]" />
      ) : (
        <Moon className="w-[20px] h-[20px]" />
      )}
      Change theme
    </div>
  );
};

export default ChangeTheme;
