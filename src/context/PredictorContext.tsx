'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface PredictorContextType {
  isPredictorMode: boolean;
  setIsPredictorMode: (val: boolean) => void;
  bracketPredictions: Record<string, number>; // matchId -> winnerTeamId
  setBracketPrediction: (matchId: string, teamId: number) => void;
  groupPredictions: Record<number, { home: number; away: number }>; // matchId -> scores
  setGroupPrediction: (matchId: number, home: number, away: number) => void;
  resetPredictions: () => void;
}

const PredictorContext = createContext<PredictorContextType | undefined>(undefined);

export function PredictorProvider({ children }: { children: ReactNode }) {
  const [isPredictorMode, setIsPredictorMode] = useState(false);
  const [bracketPredictions, setBracketPredictions] = useState<Record<string, number>>({});
  const [groupPredictions, setGroupPredictions] = useState<Record<number, { home: number; away: number }>>({});

  const setBracketPrediction = useCallback((matchId: string, teamId: number) => {
    setBracketPredictions(prev => ({ ...prev, [matchId]: teamId }));
  }, []);

  const setGroupPrediction = useCallback((matchId: number, home: number, away: number) => {
    setGroupPredictions(prev => ({ ...prev, [matchId]: { home, away } }));
  }, []);

  const resetPredictions = useCallback(() => {
    setBracketPredictions({});
    setGroupPredictions({});
  }, []);

  const value = useMemo(() => ({
    isPredictorMode, 
    setIsPredictorMode, 
    bracketPredictions, 
    setBracketPrediction,
    groupPredictions,
    setGroupPrediction,
    resetPredictions
  }), [
    isPredictorMode,
    bracketPredictions,
    groupPredictions,
    setBracketPrediction,
    setGroupPrediction,
    resetPredictions
  ]);

  return (
    <PredictorContext.Provider value={value}>
      {children}
    </PredictorContext.Provider>
  );
}

export function usePredictor() {
  const context = useContext(PredictorContext);
  if (context === undefined) {
    throw new Error('usePredictor must be used within a PredictorProvider');
  }
  return context;
}
