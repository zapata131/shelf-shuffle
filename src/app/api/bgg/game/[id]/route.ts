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
    const normalized = details.map((item: any) => normalizeBGGGame(item));

    // If it was a single ID, we can still return just the object to avoid breaking changes
    // but the frontend logic in page.tsx will need to handle both or we just always return array.
    // For "Add All", we definitely want an array.
    return NextResponse.json(id.includes(",") ? normalized : normalized[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
