import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const location = formData.get("location") as string;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = image.type || "image/jpeg";

    // Call Claude Vision to analyze the dog
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64,
                },
              },
              {
                type: "text",
                text: `You are a veterinary expert and animal identification specialist. Analyze this photo of a dog and provide a detailed profile. Respond ONLY with valid JSON in this exact format, no other text:

{
  "breed": "Best guess at breed or mix (e.g., 'Golden Retriever', 'Lab/Shepherd Mix')",
  "color": "Primary coat color and pattern (e.g., 'Tan with white chest', 'Black and brown brindle')",
  "size": "small, medium, large, or xlarge",
  "distinguishingFeatures": ["feature 1", "feature 2", "feature 3"],
  "hasCollar": true/false,
  "collarDescription": "Description of collar if visible, or null",
  "estimatedAge": "puppy, young, adult, or senior",
  "gender": "male, female, or unknown",
  "description": "A 2-3 sentence natural language description of the dog that someone could use to identify it",
  "confidence": "high, medium, or low - how confident you are in the breed identification",
  "healthNotes": "Any visible health concerns (limping, thin, matted fur, etc.) or 'Appears healthy'"
}

Be specific about distinguishing features like ear shape, tail type, facial markings, scars, eye color, etc. These details help match the dog to lost pet reports.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", errText);
      return NextResponse.json(
        { error: "AI analysis failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse the JSON from Claude's response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const profile = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      profile,
      location: location || "Riverview, FL",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
