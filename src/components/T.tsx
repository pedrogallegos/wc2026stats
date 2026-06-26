'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function T({ tKey }: { tKey: string }) {
  const { t } = useLanguage();
  return <>{t(tKey)}</>;
}
