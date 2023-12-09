import { readdirSync, statSync, existsSync } from 'node:fs'

const folders = readdirSync('src').filter((file) => {
  const stat = statSync(`src/${file}`)
  return stat.isDirectory() && existsSync(`src/${file}/config.toml`)
})

export default folders
