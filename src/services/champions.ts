import type { Champion, ChampionSkin } from "@/types/champion";
import championsData from "@/mock/champions.json";

const CDN_VERSION = "13.24.1";
const SPLASH_BASE = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash`;
const SQUARE_BASE = `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion`;

const raw = championsData as { data: Record<string, Champion & { id?: string }> };

export function getChampionsList(): Champion[] {
  return Object.entries(raw.data).map(([key, c]) => ({
    ...c,
    id: c.id ?? key,
  }));
}

export function getChampionById(id: string): Champion | undefined {
  const entry = raw.data[id];
  if (!entry) return undefined;
  return { ...entry, id: entry.id ?? id };
}

export function getChampionSplash(championId: string, skinIndex: number): string {
  return `${SPLASH_BASE}/${championId}_${skinIndex}.jpg`;
}

export function getChampionSquare(championId: string): string {
  const champ = raw.data[championId];
  const filename = champ?.image?.full ?? `${championId}.png`;
  return `${SQUARE_BASE}/${filename}`;
}

export function getChampionSkins(championId: string, count: number = 4): ChampionSkin[] {
  const names = ["Default", "Skin 1", "Skin 2", "Skin 3", "Skin 4", "Skin 5"];
  return Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    id: i,
    name: names[i] ?? `Skin ${i}`,
    splashUrl: getChampionSplash(championId, i),
  }));
}

export function getFreeRotationChampions(limit: number = 6): Champion[] {
  const list = getChampionsList();
  const indices = [0, 10, 20, 30, 40, 50].slice(0, limit);
  return indices.map((i) => list[i % list.length]).filter(Boolean);
}
