import { getCache, setCache } from "@/lib/cache"
import { getLatestAnime } from "@/lib/engine"

export async function GET() {
  const key = "latest"

  try {
    // 1. cek cache dulu
    const cached = getCache(key)
    if (cached) {
      return Response.json({
        status: true,
        creator: "YUE",
        source: "cache",
        data: cached
      })
    }

    // 2. ambil data
    const data = await getLatestAnime()

    // 3. simpan cache
    setCache(key, data)

    return Response.json({
      status: true,
      creator: "YUE",
      source: "live",
      data
    })

  } catch (err) {
    console.log("ERROR API:", err.message)

    return Response.json({
      status: false,
      error: "Failed to fetch latest anime",
      detail: err.message
    }, { status: 500 })
  }
}
