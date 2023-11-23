import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)

export function readJSON(fileName) {
    return require('../'+fileName)
}