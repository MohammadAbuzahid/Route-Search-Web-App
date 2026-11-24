import { bfs } from './algorithms/bfs'
import { dfs } from './algorithms/dfs'
import { ucs } from './algorithms/ucs'
import { greedy } from './algorithms/greedy'
import { astar } from './algorithms/astar'

const searches = { bfs, dfs, ucs, greedy, astar }

self.onmessage = ({ data }) => {
  try {
    const search = searches[data.id as keyof typeof searches]
    if (!search) throw new Error('Unknown algorithm')

    const result = search(data.map, data.start, data.goal)

    self.postMessage({
      ...result,
      error: result.path.length ? undefined : 'No route found.',
    })
  } catch {
    self.postMessage({
      path: [],
      error: 'The search algorithm could not complete.',
    })
  }
}