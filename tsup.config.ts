import {
  readFileSync,
  writeFileSync,
} from 'node:fs'
import chalk from 'chalk'
import { defineConfig } from 'tsup'
import scripts from './src/utility/folder'

function log(...args: any[]) {
  // eslint-disable-next-line no-console
  console.log(chalk.hex('#f4b8e4')('BUILD'), ...args)
}

function convertConfig(data: Record<string, any>): {
  list: [string, string][]
  map: Map<string, string>
} {
  const list: [string, string][] = []
  const map = new Map<string, string>()

  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((i) => {
        list.push([k, i])
        map.set(k, i)
      })
    }
    else if (typeof v === 'object' && v !== null) {
      Object.entries<string>(v).forEach(([subK, v]) => {
        if (subK === 'default') {
          list.push([k, v])
          map.set(k, v)
        }
        else {
          list.push([`${k}:${subK}`, v])
          map.set(`${k}:${subK}`, v)
        }
      })
    }
    else {
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
scripts.forEach(script => log(`- ${script}`))

export default defineConfig({
  entry: Object.fromEntries(
    scripts.map(script => [script, `src/${script}/main.ts`]),
  ),
  format: ['iife'],
  clean: true,
  outExtension: () => ({ js: '.user.js' }),
  async onSuccess() {
    const { default: baseConfigObj } = await import('./src/config.base')
    const { list: baseConfig } = convertConfig(baseConfigObj)

    for (const script of scripts) {
      const { default: scriptConfigObj } = await import(`./src/${script}/config.ts`)
      const { list: scriptConfig } = convertConfig(scriptConfigObj)

      const allConfig = baseConfig.concat(scriptConfig)
      const config = HIGH_PRIORITY_CONFIG_KEYS.map(key =>
        allConfig.find(([k]) => k === key),
      )
        .concat(
          allConfig.filter(([k]) => !HIGH_PRIORITY_CONFIG_KEYS.includes(k)),
        )
        .filter(i => i !== undefined) as [string, string][]

      writeFileSync(
        `dist/${script}.user.js`,
        `// ==UserScript==\n${config
          .map(([k, v]) => {
            if (k === 'matches') {
              const matches = v.split(',').map(i => i.trim())
              if (matches.length === 0) {
                return ''
              }

              let matchText = ''
              matches.forEach((match) => {
                matchText += `// @match ${match}\n`
              })
              return matchText
            }
            else {
              return `// @${k} ${v}`
            }
          })
          .join('\n')}\n// ==/UserScript==\n\n${readFileSync(
          `dist/${script}.user.js`,
          'utf-8',
        )}`,
      )
    }
  },
})
