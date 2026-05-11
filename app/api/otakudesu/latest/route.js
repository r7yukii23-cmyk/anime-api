import { getCache, setCache } from "@/lib/cache"
import { getLatestAnime } from "@/lib/engine"

export async function GET() {
  const key = "latest"

  // 1. cek cache dulu
  const cached = getCache(key)
  if (cached) {
    return Response.json({
      status: true,
      creator:"YUE"
      source: "cache",
      data: cached
    })
  }

  // 2. kalau kosong ambil dari website
  const data = await getLatestAnime()

  // 3. simpan cache 24 jam
  setCache(key, data)

  return Response.json({
    status: true,
    creator:"YUE"
    source: "live",
    data
  })
}