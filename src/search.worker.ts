import { ucs } from './algorithms/ucs'
import { bfs } from './algorithms/bfs'

self.onmessage = ({ data }) => {
  try {
    const search = data.id === 'bfs' ? bfs : data.id === 'ucs' ? ucs : undefined
    if (!search) throw new Error('Algorithm is not connected')
    const result = search(data.map, data.start, data.goal)
    self.postMessage({ ...result, error: result.path.length ? undefined : 'No route found.' })
  } catch {
    self.postMessage({ path: [], error: 'The existing search algorithm could not complete.' })
  }
}
