const actions = ['mix-compile', 'mix-deps-compile', 'mix-deps-get', 'setup-mix']

const config = {
  bundle: true,
  entryNames: '[dir]/dist/index',
  entryPoints: actions.map((a) => `src/${a}/entry.ts`),
  loader: {
    '.exs': 'text',
  },
  minify: true,
  outbase: 'src',
  outdir: 'actions',
  platform: 'node',
  target: 'node16',
  watch: process.argv.indexOf('--watch') > -1,
}

require('esbuild')
  .build(config)
  .catch(() => process.exit(1))
