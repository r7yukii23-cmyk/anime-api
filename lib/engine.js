import axios from "axios"
import * as cheerio from "cheerio"

const BASE_ONGOING = "https://otakudesu.blog/ongoing-anime"
const BASE_COMPLETED = "https://otakudesu.blog/complete-anime"

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml",
  "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
  "Referer": "https://google.com"
}

async function scrapeList(url) {
  try {
    const { data } = await axios.get(url, {
      headers,
      timeout: 15000
    })

    const $ = cheerio.load(data)

    // fallback selector (biar gak kosong)
    const list = $(".venz ul li").length
      ? $(".venz ul li")
      : $(".home-content ul li")

    let result = []

    list.each((i, el) => {
      const title =
        $(el).find(".jdlflm").text().trim() ||
        $(el).find("h2, h3").text().trim()

      const episode = $(el).find(".epz").text().trim()
      const thumbnail = $(el).find("img").attr("src")
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
