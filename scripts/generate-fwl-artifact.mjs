import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildFwlExport } from '../../AToW-Reference-Data/dist/src/fwl-export.js'

const root = fileURLToPath(new URL('../../AToW-Reference-Data/', import.meta.url))
const artifact = await buildFwlExport(root, 'c83652c36cb5078aaadc072dea5f57dcad1fd563')
const output = fileURLToPath(new URL('../src/experimental/generated/fwl-export.json', import.meta.url))
await mkdir(resolve(output, '..'), { recursive: true })
await writeFile(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8')
console.log(`Generated ${output} (${artifact.contentDigest})`)
