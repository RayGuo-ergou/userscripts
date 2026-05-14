const config: Partial<Tampermonkey.ScriptMetadata> = {
  name: 'Asana Ctrl+Enter to Enter',
  description: 'Map Ctrl+Enter to Enter in Asana to prevent accidental task completion',
  version: '1.0.0',
  matches: ['https://app.asana.com/*'],
  'run-at': 'document-start',
}

export default config
