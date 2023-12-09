import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { defineConfig } from 'tsup'
import { load } from 'js-toml'
import chalk from 'chalk'
import scripts from './src/utility/folder'

function log(...args: any[]) {
  console.log(chalk.hex('#f4b8e4')('BUILD'), ...args)
}

function convertConfig(configPath: string): {
  list: [string, string][]
  map: Map<string, string>
} {
  const raw = load(readFileSync(configPath, 'utf-8'))
  const list: [string, string][] = []
  const map = new Map<string, string>()

  Object.entries(raw).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((i) => {
        list.push([k, i])
        map.set(k, i)
      })
    } else if (typeof v === 'object') {
      Object.entries<string>(v).forEach(([subK, v]) => {
        if (subK === 'default') {
          list.push([k, v])
          map.set(k, v)
        } else {
          list.push([`${k}:${subK}`, v])
          map.set(`${k}:${subK}`, v)
        }
      })
    } else {
      list.push([k, v])
      map.set(k, v)
    }
  })

  return { list, map }
}

const HIGH_PRIORITY_CONFIG_KEYS = [
  'name',
  'name:zh-CN',
  'namespace',
  'version',
  'description',
  'description:zh-CN',
  'author',
]

log(`scripts to build:`)
scripts.forEach((script) => log(`- ${script}`))

export default defineConfig({
  entry: Object.fromEntries(
    scripts.map((script) => [script, `src/${script}/main.ts`]),
  ),
  format: ['iife'],
  clean: true,
  outExtension: () => ({ js: '.user.js' }),
  async onSuccess() {
    const { list: baseConfig } = convertConfig('src/config.base.toml')
    scripts.forEach(async (script) => {
      const { list: scriptConfig, map } = convertConfig(
        `src/${script}/config.toml`,
      )

      const allConfig = baseConfig.concat(scriptConfig)
      const config = HIGH_PRIORITY_CONFIG_KEYS.map((key) =>
        allConfig.find(([k]) => k === key),
      )
        .concat(
          allConfig.filter(([k]) => !HIGH_PRIORITY_CONFIG_KEYS.includes(k)),
        )
        .filter((i) => i !== undefined) as [string, string][]

      writeFileSync(
        `dist/${script}.user.js`,
        `// ==UserScript==\n${config
          .map(([k, v]) => {
            if (k === 'matches') {
              const matches = v.split(',').map((i) => i.trim())
              if (matches.length === 0) {
                return ''
              }
              let matchText = ''
              matches.forEach((match) => {
                matchText += `// @match ${match}\n`
              })
              return matchText
            } else {
              return `// @${k} ${v}`
            }
          })
          .join('\n')}\n// ==/UserScript==\n\n${readFileSync(
          `dist/${script}.user.js`,
          'utf-8',
        )}`,
      )
    })
  },
})
