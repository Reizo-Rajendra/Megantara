"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

interface TransitionContextType {
  triggerTransition: (path: string) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  targetPath: string | null;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isAnimating, setIsAnimatingState] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  // Ref agar pengecekan "sedang animasi" tidak bergantung pada closure state.
  const animatingRef = useRef(false);

  const setIsAnimating = useCallback((value: boolean) => {
    animatingRef.current = value;
    setIsAnimatingState(value);
  }, []);

  const triggerTransition = useCallback((path: string) => {
    // Cegah trigger ganda (mis. klik beruntun) tanpa side effect di state updater.
    if (animatingRef.current) return;
    animatingRef.current = true;
    setTargetPath(path);
    setIsAnimatingState(true);
  }, []);

  const value = useMemo(
    () => ({ triggerTransition, isAnimating, setIsAnimating, targetPath }),
    [triggerTransition, isAnimating, setIsAnimating, targetPath],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useTransitionContext must be used within a TransitionProvider"
    );
  }
  return context;
};
