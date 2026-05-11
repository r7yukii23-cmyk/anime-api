const cache = new Map()

// simpan cache 24 jam
export function setCache(key, data) {
  cache.set(key, {
    data,
    expire: Date.now() + 24 * 60 * 60 * 1000
  })
}

// ambil cache
export function getCache(key) {
  const item = cache.get(key)

  if (!item) return null

  if (Date.now() > item.expire) {
    cache.delete(key)
    return null
  }

  return item.data
}