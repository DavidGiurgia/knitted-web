'use client';

import { createContext, useContext, useState } from "react";

const PanelContext = createContext();

export const PanelProvider = ({ children }) => {
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

  //const activeSubPanel = subPanelsStack[subPanelsStack.length - 1];

  return (
    <PanelContext.Provider
      value={{
        activePanel,
        switchPanel,
        subPanelsStack,
        activeSubPanel: subPanelsStack[subPanelsStack.length - 1],
        pushSubPanel,
        popSubPanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanel = () => useContext(PanelContext);
