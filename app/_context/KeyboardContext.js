"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const KeyboardContext = createContext();

export const KeyboardProvider = ({ children }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const newScreenHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardIsVisible = newScreenHeight < screenHeight;


      setIsKeyboardOpen(keyboardIsVisible);
      setKeyboardHeight(keyboardIsVisible ? screenHeight - newScreenHeight : 0);
      setScreenHeight(newScreenHeight);
    };

    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [screenHeight]);

  return (
    <KeyboardContext.Provider value={{ isKeyboardOpen, keyboardHeight }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => useContext(KeyboardContext);
