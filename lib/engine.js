export async function getLatestAnime() {
  const [ongoingRes, completedRes] = await Promise.all([
    axios.get("https://otakudesu.blog/ongoing-anime"),
    axios.get("https://otakudesu.blog/complete-anime")
  ])

  const $1 = cheerio.load(ongoingRes.data)
  const $2 = cheerio.load(completedRes.data)

  const ongoing = []
  const completed = []

  $1(".venz ul li").each((i, el) => {
    ongoing.push({
      title: $1(el).find(".jdlflm").text().trim(),
      episode: $1(el).find(".epz").text().trim(),
      thumbnail: $1(el).find("img").attr("src"),
      url: $1(el).find("a").attr("href")
    })
  })

  $2(".venz ul li").each((i, el) => {
    completed.push({
      title: $2(el).find(".jdlflm").text().trim(),
      episode: $2(el).find(".epz").text().trim(),
      thumbnail: $2(el).find("img").attr("src"),
      url: $2(el).find("a").attr("href")
    })
  })

  return { ongoing, completed }
}
