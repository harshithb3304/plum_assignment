import { UserProfile, WellnessTip } from './types';

export const localStorageKeys = {
  userProfile: 'wellness-user-profile',
  favoriteTips: 'wellness-favorite-tips',
  allTips: 'wellness-all-tips'
} as const;

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    // Check if profile has changed significantly (age, gender, or goals)
    const existingProfile = getUserProfile();
    
    if (existingProfile) {
      const significantChange = 
        existingProfile.age !== profile.age || 
        existingProfile.gender !== profile.gender ||
        JSON.stringify(existingProfile.goals.sort()) !== JSON.stringify(profile.goals.sort());
      
      if (significantChange) {
        // Clear favorites when profile changes significantly
        localStorage.removeItem(localStorageKeys.favoriteTips);
        localStorage.removeItem(localStorageKeys.allTips);
      }
    }
    
    localStorage.setItem(localStorageKeys.userProfile, JSON.stringify(profile));
  }
}

export function getUserProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(localStorageKeys.userProfile);
    return saved ? JSON.parse(saved) : null;
  }
  return null;
}

export function saveFavoriteTips(tips: WellnessTip[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(localStorageKeys.favoriteTips, JSON.stringify(tips));
  }
}

export function getFavoriteTips(): WellnessTip[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(localStorageKeys.favoriteTips);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

export function addToFavorites(tip: WellnessTip): void {
  const favorites = getFavoriteTips();
  const isAlreadyFavorite = favorites.some(fav => fav.id === tip.id);
  
  if (!isAlreadyFavorite) {
    favorites.push(tip);
    saveFavoriteTips(favorites);
  }
}

export function removeFromFavorites(tipId: string): void {
  const favorites = getFavoriteTips();
  const updated = favorites.filter(fav => fav.id !== tipId);
  saveFavoriteTips(updated);
}

export function isFavorite(tipId: string): boolean {
  const favorites = getFavoriteTips();
  return favorites.some(fav => fav.id === tipId);
}

export function saveAllTips(tips: WellnessTip[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(localStorageKeys.allTips, JSON.stringify(tips));
  }
}

export function getAllTips(): WellnessTip[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(localStorageKeys.allTips);
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}