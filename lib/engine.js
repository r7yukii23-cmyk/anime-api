import axios from "axios"
import * as cheerio from "cheerio"

// =========================
// 🌐 BASE
// =========================
const BASE = "https://otakudesu.blog/ongoing-anime/"

// =========================
// 🧠 HEADERS (anti basic bot)
// =========================
function getHeaders() {
  const uas = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/121 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  ]

  return {
    "User-Agent": uas[Math.floor(Math.random() * uas.length)],
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
    "Referer": "https://www.google.com/",
    "Cache-Control": "no-cache"
  }
}

// =========================
// ⏱ delay helper
// =========================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// =========================
// 🔁 SAFE FETCH (retry)
// =========================
async function fetchSafe(url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      await sleep(300 + Math.random() * 800)

      const { data } = await axios.get(url, {
        headers: getHeaders(),
        timeout: 20000
      })

      return data
    } catch (err) {
      if (i === retry - 1) throw err
    }
  }
}

// =========================
// 📌 LIST ANIME
// =========================
export async function getAnimeList(limit = 10) {
  const html = await fetchSafe(BASE)
  const $ = cheerio.load(html)

  const list = []

  $(".venz ul li").each((_, el) => {
    const title = $(el).find(".jdlflm").text().trim()
    const url = $(el).find("a").attr("href")

    const thumbnail =
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("data-lazy-src") ||
      $(el).find("img").attr("data-original") ||
      null

    if (title && url) {
      list.push({ title, url, thumbnail })
    }
  })

  return list.slice(0, limit)
}

// =========================
// 📌 DETAIL ANIME
// =========================
export async function getAnimeDetail(url) {
  const html = await fetchSafe(url)
  const $ = cheerio.load(html)

  const title = $(".jdlrx h1").text().trim()
  const poster = $(".imganime img").attr("src") || null
  const synopsis = $(".sinopc p").text().trim()

  const info = {}

  $(".infozingle p").each((_, el) => {
    const text = $(el).text().split(":")
    if (text.length === 2) {
      info[text[0].trim()] = text[1].trim()
    }
  })

  const episodes = []

  $(".episodelist ul li").each((_, el) => {
    const a = $(el).find("a")
    episodes.push({
      title: a.text().trim(),
      url: a.attr("href")
    })
  })

  return {
    title,
    poster,
    synopsis,
    info,
    episodes
  }
}

// =========================
// 🚀 FULL API (combine)
// =========================
export async function getAllAnime(limit = 10) {
  try {
    const list = await getAnimeList(limit)

    const result = await Promise.all(
      list.map(async (anime) => {
        try {
          return await getAnimeDetail(anime.url)
        } catch {
          return null
        }
      })
    )

    return result.filter(Boolean)
  } catch (err) {
    console.log("ENGINE ERROR:", err.message)
    return []
  }
}
