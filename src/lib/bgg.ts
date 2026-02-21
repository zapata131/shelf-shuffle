import { XMLParser } from "fast-xml-parser";

const BGG_API_BASE = "https://boardgamegeek.com/xmlapi2";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export interface BGGCollectionItem {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  numplayers?: { min: number; max: number };
  playingtime?: number;
  yearpublished?: number;
}

const BGG_API_KEY = process.env.BGG_API_KEY;

const FETCH_HEADERS = {
  "User-Agent": "ShelfShuffler (Board Game Collection App)",
  ...(BGG_API_KEY ? { "Authorization": `Bearer ${BGG_API_KEY}` } : {}),
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

async function fetchWithRetry(url: string, attempts = 0): Promise<Response> {
  const response = await fetch(url, { headers: FETCH_HEADERS });

  if (response.status === 202 && attempts < MAX_RETRIES) {
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return fetchWithRetry(url, attempts + 1);
  }

  return response;
}

export async function getBGGCollection(username: string): Promise<BGGCollectionItem[]> {
  const url = `${BGG_API_BASE}/collection?username=${username}&own=1`;
  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch collection for ${username}: ${response.status} ${response.statusText}`);
  }

  const xmlData = await response.text();
  const jsonData = parser.parse(xmlData);

  if (!jsonData.items || !jsonData.items.item) {
    return [];
  }

  const items = Array.isArray(jsonData.items.item) ? jsonData.items.item : [jsonData.items.item];

  return items.map((item: any) => ({
    id: item["@_objectid"],
    name: item.name["#text"] || item.name,
    image: item.image,
    thumbnail: item.thumbnail,
    yearpublished: item.yearpublished,
  }));
}

export async function getBGGGameDetails(ids: string | string[]) {
  const idString = Array.isArray(ids) ? ids.join(",") : ids;
  const url = `${BGG_API_BASE}/thing?id=${idString}&stats=1`;
  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch game details for ${idString}: ${response.status} ${response.statusText}`);
  }

  const xmlData = await response.text();
  const jsonData = parser.parse(xmlData);

  if (!jsonData.items || !jsonData.items.item) {
    return [];
  }

  return Array.isArray(jsonData.items.item) ? jsonData.items.item : [jsonData.items.item];
}

