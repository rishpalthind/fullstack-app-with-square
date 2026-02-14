import { LocalStorageData } from '@/types';

const STORAGE_KEYS = {
  SELECTED_LOCATION: 'perdiem_selected_location',
  USER_PREFERENCES: 'perdiem_user_preferences',
} as const;

/**
 * Local storage utility with error handling and type safety
 */
export class StorageService {
  /**
   * Get selected location ID from localStorage
   */
  static getSelectedLocationId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_LOCATION);
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }

  /**
   * Set selected location ID in localStorage
   */
  static setSelectedLocationId(locationId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_LOCATION, locationId);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  }

  /**
   * Remove selected location from localStorage
   */
  static clearSelectedLocationId(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_LOCATION);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get user preferences from localStorage
   */
  static getUserPreferences(): Partial<LocalStorageData> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.warn('Failed to parse user preferences from localStorage:', error);
      return {};
    }
  }

  /**
   * Set user preferences in localStorage
   */
  static setUserPreferences(preferences: Partial<LocalStorageData>): void {
    try {
      const existingPrefs = this.getUserPreferences();
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
    } catch (error) {
      console.warn('Failed to save user preferences to localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all app data from localStorage
   */
  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}