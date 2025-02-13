"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PanelContext = createContext();

export const PanelProvider = ({ children }) => {
  // 🖥️ Adăugăm screenSize
  const [screenSize, setScreenSize] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const updateScreenSize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", updateScreenSize);

    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const [bottombar, setBottombar] = useState(true);
  // Stocăm istoricul subpanourilor pentru fiecare panou principal
  const [panelData, setPanelData] = useState({
    Home: ["Home"], // Home are doar Home în istoricul său
  });

  // Panoul principal activ
  const [activePanel, setActivePanel] = useState("Home");

  // Obține array-ul subpanourilor pentru panoul activ
  const subPanelsStack = panelData[activePanel] || ["Home"];

  // Funcție pentru a comuta la un alt panou principal
  const switchPanel = (panel) => {
    if (!panelData[panel]) {
      // Dacă panoul nu are un istoric, inițializăm cu numele său
      setPanelData((prev) => ({
        ...prev,
        [panel]: [panel],
      }));
    }
    setActivePanel(panel); // Activăm panoul principal
  };

  // Funcție pentru a adăuga un subpanou la panoul curent
  const pushSubPanel = (subPanel, param = null) => {
    window.history.pushState(null, "", window.location.href); // Adaugă un state fals în istoric

    setPanelData((prev) => ({
      ...prev,
      [activePanel]: [...subPanelsStack, { subPanel, param }],
    }));
  };

  // Funcție pentru a elimina ultimul subpanou din panoul curent
  const popSubPanel = () => {
    if (subPanelsStack.length > 1) {
      setPanelData((prev) => ({
        ...prev,
        [activePanel]: subPanelsStack.slice(0, -1),
      }));
    }
  };

  // Funcție pentru a reseta complet un panou principal la starea inițială
  const resetPanel = () => {
    setPanelData((prev) => ({
      ...prev,
      [activePanel]: [activePanel], // Resetăm la panoul principal activ
    }));
  };

  const resetSession = () => {
    setPanelData((prev) => ({
      Home: ["Home"], // Reseteazăm panoul principal Home
    }));
    setActivePanel("Home"); // Activăm panoul principal Home
    setBottombar(true); // Afisează butonul de subsol
  };

  const activeSubPanel = subPanelsStack[subPanelsStack.length - 1];

  useEffect(() => {
    const hiddenBottombarPanels = [
      "CreatePost",
      "CreateGroup",
      "NewChatSection",
      "EditProfile",
      "ChatRoom",
      "CreateDrawing",
      "EditImage",
      "TextStatus",
      "PostSettings"
    ];
    const shouldHideBottombar = hiddenBottombarPanels.includes(
      activeSubPanel?.subPanel
    );
    setBottombar(!shouldHideBottombar);
  }, [activeSubPanel]);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); // Prevenim comportamentul implicit al browserului
  
      if (subPanelsStack.length > 1) {
        popSubPanel(); // Dacă există subpanouri, elimină ultimul subpanou
      } else if (activePanel !== "Home") {
        switchPanel("Home"); // Dacă nu mai sunt subpanouri, trecem la Home
      } else {
        resetSession(); // Dacă suntem deja în Home, resetăm sesiunea
      }
  
      // Adăugăm un nou state fals în istoric pentru a împiedica navigarea nativă
      window.history.pushState(null, "", window.location.href);
    };
  
    // Adăugăm un state fals la inițializare
    window.history.pushState(null, "", window.location.href);
  
    window.addEventListener("popstate", handleBackButton);
  
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [activePanel, subPanelsStack]);
  

  return (
    <PanelContext.Provider
      value={{
        activePanel,
        switchPanel,
        subPanelsStack,
        activeSubPanel,
        pushSubPanel,
        popSubPanel,
        resetPanel,
        bottombar,
        setBottombar,
        resetSession,
        screenSize, // 👈 Adăugat în context
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => useContext(PanelContext);
