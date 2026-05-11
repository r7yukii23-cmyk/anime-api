import axios from "axios"
import * as cheerio from "cheerio"

const BASE = "https://otakudesu.blog/ongoing-anime/"

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

//
// 🔥 AMBIL LIST ANIME
//
export async function getAnimeList(limit = 1) {
  const { data } = await axios.get(BASE, { headers })
  const $ = cheerio.load(data)

  let list = []

  $(".venz ul li").each((i, el) => {
    const title = $(el).find(".jdlflm").text().trim()
    const url = $(el).find("a").attr("href")

    const thumbnail =
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src") ||
      $(el).find("img").attr("data-lazy-src") ||
      null

    if (title && url) {
      list.push({
        title,
        url,
        thumbnail
      })
    }
  })

  return list.slice(0, limit)
}

//
// 🔥 AMBIL DETAIL ANIME
//
export async function getAnimeDetail(url) {
  const { data } = await axios.get(url, { headers })
  const $ = cheerio.load(data)

  const title = $(".jdlrx h1").text().trim()
  const poster = $(".imganime img").attr("src")
  const synopsis = $(".sinopc p").text().trim()

  let info = {}

  $(".infozingle p").each((i, el) => {
    const text = $(el).text().split(":")
    if (text.length === 2) {
      info[text[0].trim()] = text[1].trim()
    }
  })

  let episodes = []

  $(".episodelist ul li").each((i, el) => {
    episodes.push({
      title: $(el).find("a").text().trim(),
      url: $(el).find("a").attr("href")
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

//
// 🔥 COMBINE ALL (FULL API)
//
export async function getAllAnime(limit = 1) {
  const list = await getAnimeList(limit)

  const result = await Promise.all(
    list.map(async (anime) => {
      try {
        return await getAnimeDetail(anime.url)
      } catch (err) {
        return null
      }
    })
  )

  return result.filter(Boolean)
      }
