export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeed: number;
  attackspeedperlevel: number;
}

export interface ChampionImage {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: ChampionInfo;
  image: ChampionImage;
  tags: string[];
  partype: string;
  stats: ChampionStats;
}

export interface ChampionSkin {
  id: number;
  name: string;
  splashUrl: string;
}

export interface ChampionsDataResponse {
  type: string;
  format: string;
  version: string;
  data: Record<string, Omit<Champion, "id"> & { id?: string }>;
}

export const ROLE_FILTERS = ["Top", "Jungle", "Mid", "ADC", "Support"] as const;
export type RoleFilter = (typeof ROLE_FILTERS)[number];

export const ROLE_TO_TAGS: Record<RoleFilter, string[]> = {
  Top: ["Fighter", "Tank"],
  Jungle: ["Fighter", "Tank", "Assassin"],
  Mid: ["Mage", "Assassin"],
  ADC: ["Marksman"],
  Support: ["Support"],
};
