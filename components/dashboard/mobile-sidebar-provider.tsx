"use client";

import { useState, createContext, useContext } from "react";

interface MobileSidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}
