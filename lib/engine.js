import axios from "axios"
import * as cheerio from "cheerio"

const BASE = "https://otakudesu.blog"

export async function getLatestAnime() {
  const { data } = await axios.get(BASE)
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
}