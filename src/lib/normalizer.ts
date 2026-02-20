export interface NormalizedGame {
  id: string;
  title: string;
  designer: string;
  artist: string;
  image: string;
  description: string;
  players: string; // "min-max"
  time: string; // "avg"
  weight: number; // x.x/5
}

export function cleanBGGDescription(html?: string): string {
  if (!html) return "";
  // Simple regex to strip HTML tags and unescape common entities
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#10;/g, " ")
    .replace(/&#13;/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
    .slice(0, 200); // Top 150-200 characters as per spec
}

export function normalizeBGGGame(item: any): NormalizedGame {
  const stats = item.statistics?.ratings;
  
  // Extract designer and artist from links
  const links = Array.isArray(item.link) ? item.link : [item.link];
  const designer = links.find((l: any) => l["@_type"] === "boardgamedesigner")?.["@_value"] || "Unknown Designer";
  const artist = links.find((l: any) => l["@_type"] === "boardgameartist")?.["@_value"] || "Unknown Artist";

  const minPlayers = item.minplayers?.["@_value"];
  const maxPlayers = item.maxplayers?.["@_value"];
  const players = minPlayers === maxPlayers ? `${minPlayers}` : `${minPlayers}-${maxPlayers}`;

  const avgTime = item.playingtime?.["@_value"] || "N/A";
  const weight = parseFloat(stats?.averageweight?.["@_value"] || "0").toFixed(1);

  const title = Array.isArray(item.name) 
    ? item.name.find((n: any) => n["@_type"] === "primary")?.["@_value"] || item.name[0]["@_value"]
    : item.name?.["@_value"] || "Unknown Game";

  return {
    id: item["@_id"],
    title,
    designer,
    artist,
    image: item.image,
    description: cleanBGGDescription(item.description),
    players,
    time: `${avgTime} min`,
    weight: parseFloat(weight),
  };
}
