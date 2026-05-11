import { getCache, setCache } from "@/lib/cache"
import { getLatestAnime } from "@/lib/engine"

export async function GET() {
  const key = "latest"

  try {
    const cached = getCache(key)
    if (cached) {
      return Response.json({
        status: true,
        creator: "YUE",
        source: "cache",
        data: cached
      })
    }

    const data = await getLatestAnime()

    setCache(key, data)

    return Response.json({
      status: true,
      creator: "YUE",
      source: "live",
      data
    })

  } catch (err) {
    console.log("API ERROR:", err.message)

    return Response.json({
      status: false,
      error: err.message,
      data: {
        ongoing: [],
        completed: []
      }
    }, { status: 200 }) // biar gak 500 lagi
  }
}
