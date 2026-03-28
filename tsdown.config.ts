import type { UserConfig } from 'tsdown'
import { readFileSync, writeFileSync } from 'node:fs'
import chalk from 'chalk'
import { defineConfig } from 'tsdown'
import scripts from './src/utility/folder.ts'

function log(...args: any[]) {
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

export default defineConfig(
  scripts.map((script, index): UserConfig => ({
    entry: { [script]: `src/${script}/main.ts` },
    clean: index === 0,
    outExtensions: () => ({ js: '.js' }),
    outputOptions: {
      entryFileNames: '[name].user.js',
    },
    format: 'iife' as const,
    dts: false,
    target: false as const,
    async onSuccess() {
      const { default: baseConfigObj } = await import('./src/config.base.ts')
      const { list: baseConfig } = convertConfig(baseConfigObj)

      const { default: scriptConfigObj } = await import(`./src/${script}/config.ts`)
      const { list: scriptConfig } = convertConfig(scriptConfigObj)

      const allConfig = baseConfig.concat(scriptConfig)
      const config = HIGH_PRIORITY_CONFIG_KEYS.map(key =>
        allConfig.find(([k]) => k === key),
      )
        .concat(allConfig.filter(([k]) => !HIGH_PRIORITY_CONFIG_KEYS.includes(k)))
        .filter(i => i !== undefined) as [string, string][]

      writeFileSync(
        `dist/${script}.user.js`,
        `// ==UserScript==\n${config
          .map(([k, v]) => {
            if (k === 'matches') {
              const matches = v.split(',').map(i => i.trim())
              if (matches.length === 0)
                return ''
              return `${matches.map(match => `// @match ${match}`).join('\n')}\n`
            }
            return `// @${k} ${v}`
          })
          .join('\n')}\n// ==/UserScript==\n\n${readFileSync(`dist/${script}.user.js`, 'utf-8')}`,
      )
    },
  })),
)
