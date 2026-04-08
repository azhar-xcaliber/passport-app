"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type SelectedContext = {
  label: string;
  section: string;
} | null;

type ChatContextValue = {
  selectedContext: SelectedContext;
  setSelectedContext: Dispatch<SetStateAction<SelectedContext>>;
};

const ChatContextCtx = createContext<ChatContextValue | null>(null);

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [selectedContext, setSelectedContext] = useState<SelectedContext>(null);

  return (
    <ChatContextCtx.Provider value={{ selectedContext, setSelectedContext }}>
      {children}
    </ChatContextCtx.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContextCtx);
  if (!context) {
    throw new Error("useChatContext must be used within ChatContextProvider");
  }
  return context;
}
