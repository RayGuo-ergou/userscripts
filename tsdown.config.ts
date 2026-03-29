import type { UserConfig } from 'tsdown'
import { readFileSync, writeFileSync } from 'node:fs'
import chalk from 'chalk'
import { defineConfig } from 'tsdown'
import scripts from './src/utility/folder.ts'

function log(...args: any[]) {
  console.log(chalk.hex('#f4b8e4')('BUILD'), ...args)
}

function convertConfig(data: Partial<Tampermonkey.ScriptMetadata>): [string, string][] {
  const entries: [string, string][] = []

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        entries.push([key, String(item)])
      }
    }
    // TODO: Likely not working correctly, fix later
    else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of Object.entries(value)) {
        const fullKey = subKey === 'default' ? key : `${key}:${subKey}`
        entries.push([fullKey, String(subValue)])
      }
    }
    else if (value !== undefined) {
      entries.push([key, String(value)])
    }
  }

  return entries
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
    format: 'iife',
    dts: false,
    target: false,
    async onSuccess() {
      const { default: baseConfigObj } = await import('./src/config.base.ts')
      const baseConfig = convertConfig(baseConfigObj)

      const { default: scriptConfigObj } = await import(`./src/${script}/config.ts`)
      const scriptConfig = convertConfig(scriptConfigObj)
      console.log(scriptConfig)

      const allConfig = baseConfig.concat(scriptConfig)
      const config = HIGH_PRIORITY_CONFIG_KEYS
        .map(key => allConfig.find(([k]) => k === key))
        .concat(allConfig.filter(([k]) => !HIGH_PRIORITY_CONFIG_KEYS.includes(k)))
        .filter((i): i is [string, string] => i !== undefined)

      writeFileSync(
        `dist/${script}.user.js`,
        `// ==UserScript==\n${config
          .map(([k, v]) => {
            if (k === 'matches') {
              const matches = v.split(',').map(i => i.trim())
              if (matches.length === 0)
                return ''
              return `${matches.map(match => `// @match ${match}`).join('\n')}`
            }
            return `// @${k} ${v}`
          })
          .join('\n')}\n// ==/UserScript==\n\n${readFileSync(`dist/${script}.user.js`, 'utf-8')}`,
      )
    },
  })),
)
