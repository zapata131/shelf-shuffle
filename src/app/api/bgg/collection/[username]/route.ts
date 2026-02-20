import { NextResponse } from "next/server";
import { getBGGCollection } from "@/lib/bgg";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const username = (await params).username;

  try {
    const collection = await getBGGCollection(username);
    return NextResponse.json(collection);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
