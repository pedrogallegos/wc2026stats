'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { translateCountry } from '@/utils/translations';

type Language = 'en' | 'es';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

const translations: Translations = {
  groupStage: { en: 'Group Stage', es: 'Fase de Grupos' },
  groupStageDesc: { en: 'Current standings for all 12 groups. The top 2 from each group qualify automatically.', es: 'Posiciones actuales de los 12 grupos. Los 2 primeros clasifican automáticamente.' },
  thirdPlaces: { en: 'Third Places', es: 'Terceros Lugares' },
  thirdPlacesDesc: { en: 'The top 8 third-place teams will join the top 2 from each group in the Round of 32.', es: 'Los 8 mejores terceros lugares se unirán a los 2 primeros de cada grupo en los Dieciseisavos.' },
  knockoutMap: { en: 'Knockout Map', es: 'Mapa Eliminatorio' },
  knockoutDesc: { en: 'Tournament bracket showing the path to the World Cup final.', es: 'Cuadro del torneo mostrando el camino a la gran final.' },
  stats: { en: 'Stats', es: 'Estadísticas' },
  statsDesc: { en: 'Top scorers, best offensive, and best defensive teams in the tournament.', es: 'Máximos goleadores, mejores ofensivas y mejores defensivas del torneo.' },
  disclaimer: { en: 'LIVE SIMULATOR', es: 'SIMULADOR EN VIVO' },
  disclaimerText: { en: 'The matchups shown here are generated in real-time based on the official FIFA mathematical matrix (Annex C). They will dynamically change depending on the results of the remaining group stage matches.', es: 'Los cruces mostrados aquí se generan en tiempo real basándose en la matriz matemática oficial de la FIFA (Anexo C). Cambiarán dinámicamente dependiendo de los resultados de los partidos restantes de la fase de grupos.' },
  topScorers: { en: 'Top Scorers', es: 'Máximos Goleadores' },
  goals: { en: 'Goals', es: 'Goles' },
  bestOffense: { en: 'Best Offense', es: 'Mejor Ofensiva' },
  bestDefense: { en: 'Best Defense', es: 'Mejor Defensiva' },
  goalsScored: { en: 'Goals Scored', es: 'Goles a Favor' },
  goalsConceded: { en: 'Goals Conceded', es: 'Goles en Contra' },
  liveMatches: { en: 'LIVE MATCHES', es: 'PARTIDOS EN VIVO' },
  todaysMatches: { en: "TODAY'S MATCHES", es: 'PARTIDOS DE HOY' },
  noLiveMatches: { en: 'No matches in play', es: 'No hay partidos en juego' },
  tbd: { en: 'TBD', es: 'Por Definir' },
  venues: { en: 'Venues', es: 'Sedes' },
  venuesDesc: { en: 'The 16 Host Cities for the 2026 World Cup across North America.', es: 'Las 16 Ciudades Sede de la Copa Mundial 2026 en Norteamérica.' },
  capacity: { en: 'Capacity', es: 'Capacidad' },
  predictorMode: { en: 'Predictor Mode', es: 'Modo Pronóstico' },
  resetPredictions: { en: 'Reset', es: 'Reiniciar' },
  advanceTeam: { en: 'Click to advance', es: 'Click para avanzar' },
  h2hTitle: { en: 'Previous Meetings', es: 'Enfrentamientos Previos' },
  wins: { en: 'Wins', es: 'Victorias' },
  draws: { en: 'Draws', es: 'Empates' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tTeam: (teamName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es'); // Default Spanish as requested

  const t = useCallback((key: string) => {
    return translations[key]?.[language] || key;
  }, [language]);
  
  const tTeam = useCallback((teamName: string) => {
    return translateCountry(teamName, language);
  }, [language]);

  const value = useMemo(() => ({
    language, setLanguage, t, tTeam
  }), [language, t, tTeam]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
