import { NextResponse } from "next/server";
import { getBGGGameDetails } from "@/lib/bgg";
import { normalizeBGGGame } from "@/lib/normalizer";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const details = await getBGGGameDetails(id);
    const normalized = normalizeBGGGame(details[0]);
    return NextResponse.json(normalized);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
