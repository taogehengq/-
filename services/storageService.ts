
import { AppState } from '../types';
import { STORAGE_KEY, INITIAL_PRIZES, DEFAULT_APP_NAME, DEFAULT_SUB_NAME, DEFAULT_WISHES, DEFAULT_RANTS, DEFAULT_PARTICIPANTS } from '../constants';

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        appName: parsed.appName ?? DEFAULT_APP_NAME,
        appSubName: parsed.appSubName ?? DEFAULT_SUB_NAME,
        appLogo: parsed.appLogo ?? null,
        prizes: parsed.prizes ?? INITIAL_PRIZES,
        participants: parsed.participants ?? DEFAULT_PARTICIPANTS,
        wishes: parsed.wishes ?? DEFAULT_WISHES,
        rants: parsed.rants ?? DEFAULT_RANTS,
        winners: parsed.winners ?? [],
        currentPrizeId: parsed.currentPrizeId ?? INITIAL_PRIZES[0].id,
      };
    } catch (e) {
      console.error("Failed to parse state", e);
    }
  }
  return {
    prizes: INITIAL_PRIZES,
    participants: DEFAULT_PARTICIPANTS,
    wishes: DEFAULT_WISHES,
    rants: DEFAULT_RANTS,
    winners: [],
    currentPrizeId: INITIAL_PRIZES[0].id,
    appName: DEFAULT_APP_NAME,
    appSubName: DEFAULT_SUB_NAME,
    appLogo: null
  };
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};
