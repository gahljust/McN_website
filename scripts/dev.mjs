import { watch } from 'node:fs'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { createRequire } from 'node:module'
import { prepareContent, root } from './prepare-content.mjs'

await prepareContent()
const require = createRequire(import.meta.url)
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--webpack', '--hostname', '127.0.0.1', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
let timer
let pending = Promise.resolve()
const watchers = ['content', 'data', 'public/images'].map(directory => watch(path.join(root, directory), { recursive: true }, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    pending = pending.then(() => prepareContent()).catch(error => console.error(error.message))
  }, 150)
}))
function cleanup() { clearTimeout(timer); watchers.forEach(watcher => watcher.close()) }
process.on('SIGINT', () => { cleanup(); child.kill('SIGINT') })
process.on('SIGTERM', () => { cleanup(); child.kill('SIGTERM') })
child.on('exit', code => { cleanup(); process.exitCode = code || 0 })
