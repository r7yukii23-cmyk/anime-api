import axios from "axios"
import * as cheerio from "cheerio"

const BASE = "https://otakudesu.blog/ongoing-anime/"

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
}

// ambil list anime dulu
export async function getAnimeList(limit = 1) {
  const { data } = await axios.get(BASE, { headers })
  const $ = cheerio.load(data)

  let list = []

  $(".venz ul li").each((i, el) => {
    const url = $(el).find("a").attr("href")

    const title = $(el).find(".jdlflm").text().trim()

    if (url && title) {
      list.push({ title, url })
    }
  })

  return list.slice(0, limit)
}

// ambil detail 1 anime
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

  return { title, poster, synopsis, info, episodes }
}

// gabungan (FULL API)
export async function getAllAnime(limit = 1) {
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
    }      const thumbnail = $(el).find("img").attr("src")
      const url = $(el).find("a").attr("href")

      if (title) {
        result.push({
          title,
          episode,
          thumbnail,
          url
        })
      }
    })

    return result
  } catch (err) {
    console.log("SCRAPE ERROR:", err.message)
    return []
  }
}

export async function getLatestAnime() {
  const [ongoing, completed] = await Promise.all([
    scrapeList(BASE_ONGOING),
    scrapeList(BASE_COMPLETED)
  ])

  return {
    ongoing,
    completed
  }
}
