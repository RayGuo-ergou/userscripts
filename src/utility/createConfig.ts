import folders from './folder.js'
import { writeFileSync } from 'node:fs'
import { cwd } from 'node:process'
import { join } from 'node:path'

const createToml = async (source: string, target: string) => {
  const { default: data } = await import(source)
  writeFileSync(target, getTomlString(data))
}

const getTomlString = (data: Partial<Tampermonkey.ScriptMetadata>) => {
  let tomlString = ''
  Object.entries(data).forEach(([k, v]) => {
    tomlString += `${k} = "${v}"\n`
  })
  return tomlString
}

const createConfigs = () => {
  // createToml for base config
  const baseSource = join(cwd(), '/src/config.base.ts')
  const baseTarget = join(cwd(), '/src/config.base.toml')
  createToml(baseSource, baseTarget)

  folders.forEach((folder) => {
    const source = join(cwd(), `/src/${folder}/config.ts`)
    const target = join(cwd(), `/src/${folder}/config.toml`)

    createToml(source, target)
  })
}

createConfigs()
