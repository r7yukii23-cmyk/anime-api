import axios from "axios"
import * as cheerio from "cheerio"

const BASE = "https://otakudesu.blog"

export async function getLatestAnime() {
  try {
    const { data } = await axios.get(BASE, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "text/html"
      },
      timeout: 15000
    })

    const $ = cheerio.load(data)

    let result = []

    $(".venz ul li").each((i, el) => {
      result.push({
        title: $(el).find(".jdlflm").text().trim(),
        episode: $(el).find(".epz").text().trim(),
        thumbnail: $(el).find("img").attr("src"),
        url: $(el).find("a").attr("href")
      })
    })

    return result
  } catch (err) {
    console.log("SCRAPER ERROR:", err.message)
    return []
  }
}
