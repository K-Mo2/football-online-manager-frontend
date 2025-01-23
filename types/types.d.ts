export interface Credentials {
  email: string;
  password: string;
  name?: string;
}

export interface UpdatePlayerPayload {
  playerId: number;
  price?: number;
  isMarketListed?: boolean;
}

export interface UpdatedRow {
  id?: number;
  price?: number;
  isMarketListed?: boolean;
  isNew: boolean;
}

export interface Player {
  name: string;
  price: number;
  position: string;
  number: number;
  teamName?: string;
  team?: Team;
}

export interface Team {
  name: string;
}
