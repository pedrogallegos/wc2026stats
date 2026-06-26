'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function TTeam({ name }: { name: string }) {
  const { tTeam } = useLanguage();
  return <>{tTeam(name)}</>;
}
