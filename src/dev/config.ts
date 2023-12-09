const config: Partial<Tampermonkey.ScriptMetadata> = {
  name: 'Dev Utils',
  description: 'A collection of utilities for developers.',
  version: '0.0.1',
  matches: ['*://*/*'],
}

export default config
