import { NextRequest, NextResponse } from "next/server";
import { validateChipNumber, getChipInfo } from "@/lib/microchip";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chipNumber } = body;

    if (!chipNumber?.trim()) {
      return NextResponse.json(
        { error: "Microchip number is required" },
        { status: 400 }
      );
    }

    const validation = validateChipNumber(chipNumber);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const info = getChipInfo(validation.cleaned);
    return NextResponse.json({ success: true, ...info });
  } catch (error) {
    console.error("Microchip lookup error:", error);
    return NextResponse.json(
      { error: "Failed to process microchip number" },
      { status: 500 }
    );
  }
}
