import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = new URLSearchParams(searchParams);

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "TMDB request failed" },
      { status: res.status },
    );
  }

  return NextResponse.json(await res.json());
}
