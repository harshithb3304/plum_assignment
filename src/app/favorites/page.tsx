'use client';

import { AppProvider } from '@/components/AppContext';
import { FavoritesScreen } from '@/components/screens/FavoritesScreen';

export default function FavoritesPage() {
  return (
    <AppProvider>
      <FavoritesScreen />
    </AppProvider>
  );
}