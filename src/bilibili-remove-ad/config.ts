const config: Partial<Tampermonkey.ScriptMetadata> = {
  name: 'Remove Bilibili Ads',
  description: 'Remove ad feed cards from Bilibili pages',
  version: '0.0.1',
  matches: ['https://www.bilibili.com/*'],
}

export default config
