const config: Partial<Tampermonkey.ScriptMetadata> = {
  name: 'DLSite Highlight ASMR on announce',
  description: 'To highlight ASMR on DLSite announce page',
  version: '0.0.1',
  matches: ['https://www.dlsite.com/maniax/announce/list/*'],
}

export default config
