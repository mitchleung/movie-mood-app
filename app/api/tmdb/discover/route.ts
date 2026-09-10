import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const withGenres = searchParams.get("with_genres");
  const page = searchParams.get("page") ?? "1";
  const voteAverageGte = searchParams.get("vote_average.gte");
  const runtimeLte = searchParams.get("with_runtime.lte");
  const runtimeGte = searchParams.get("with_runtime.gte");

  if (!withGenres || !/^[\d,]+$/.test(withGenres)) {
    return NextResponse.json(
      { error: "Invalid or missing with_genres" },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({
    with_genres: withGenres,
    sort_by: "popularity.desc",
    page,
  });
  if (voteAverageGte) params.set("vote_average.gte", voteAverageGte);
  if (runtimeLte) params.set("with_runtime.lte", runtimeLte);
  if (runtimeGte) params.set("with_runtime.gte", runtimeGte);

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
