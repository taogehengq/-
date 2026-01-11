
export interface Participant {
  id: string;
  name: string;
  department?: string;
  isWon?: boolean;
  isRigged?: boolean;
}

export interface Wish {
  id: string;
  text: string;
  color: string;
  isWon?: boolean;
}

export interface Rant {
  id: string;
  text: string;
  timestamp: number;
  isWon?: boolean;
}

export interface Prize {
  id: string;
  name: string;
  count: number;
  color: string;
  type: 'standard' | 'wish' | 'rant';
}

export interface Winner {
  id: string;
  type: 'standard' | 'wish' | 'rant';
  prizeId: string;
  prizeName: string;
  name: string;
  timestamp: number;
}

export interface AppState {
  prizes: Prize[];
  participants: Participant[];
  wishes: Wish[];
  rants: Rant[];
  winners: Winner[];
  currentPrizeId: string | null;
  appName: string;
  appSubName: string;
  appLogo: string | null;
}
