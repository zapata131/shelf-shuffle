export interface NormalizedGame {
  id: string;
  title: string;
  designer: string;
  artist: string;
  image: string;
  description: string;
  players: string;
  time: string;
  weight: number;
}

/**
 * Decodes common HTML entities and smart characters that appear in BGG data.
 */
function decodeEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#10;/g, " ")
    .replace(/&#13;/g, "")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "...")
    .replace(/&#039;/g, "'")
    .replace(/&deg;/g, "°");
}

/**
 * Strips HTML tags and decodes entities from game descriptions.
 */
export function cleanBGGDescription(html?: string): string {
  if (!html) return "";

  const stripped = html.replace(/<[^>]*>/g, "");
  const decoded = decodeEntities(stripped);

  return decoded.trim().slice(0, 200);
}

/**
 * Normalizes BGG API response data into a standard application format.
 */
export function normalizeBGGGame(item: any): NormalizedGame {
  const stats = item.statistics?.ratings;

  const links = Array.isArray(item.link) ? item.link : [item.link];
  const designer = links.find((l: any) => l["@_type"] === "boardgamedesigner")?.["@_value"] || "Unknown Designer";
  const artist = links.find((l: any) => l["@_type"] === "boardgameartist")?.["@_value"] || "Unknown Artist";

  const minPlayers = item.minplayers?.["@_value"];
  const maxPlayers = item.maxplayers?.["@_value"];
  const players = minPlayers === maxPlayers ? `${minPlayers}` : `${minPlayers}-${maxPlayers}`;

  const avgTime = item.playingtime?.["@_value"] || "N/A";
  const rawWeight = stats?.averageweight?.["@_value"] || "0";
  const weight = parseFloat(parseFloat(rawWeight).toFixed(1));

  let title = "Unknown Game";
  if (item.name) {
    if (Array.isArray(item.name)) {
      title = item.name.find((n: any) => n["@_type"] === "primary")?.["@_value"] || item.name[0]["@_value"];
    } else {
      title = item.name?.["@_value"];
    }
  }

  return {
    id: item["@_id"],
    title: decodeEntities(title),
    designer: decodeEntities(designer),
    artist: decodeEntities(artist),
    image: item.image,
    description: cleanBGGDescription(item.description),
    players,
    time: `${avgTime} min`,
    weight,
  };
}
