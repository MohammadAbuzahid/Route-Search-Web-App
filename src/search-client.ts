import type { MapData } from './types/map'

export const algorithms = [
  { id: 'bfs', name: 'Breadth-first search', label: 'BFS', ready: true },
  { id: 'dfs', name: 'Depth-first search', label: 'DFS', ready: false },
  { id: 'ucs', name: 'Uniform-cost search', label: 'UCS', ready: true },
  { id: 'greedy', name: 'Greedy best-first', label: 'Greedy', ready: false },
  { id: 'astar', name: 'A* search', label: 'A*', ready: false },
] as const
export type Result = { id: string; path: string[]; cost?: number; steps?: number; error?: string }

// Integration only: search implementations remain in algorithms/.
export function runSearch(map: MapData, start: string, goal: string, id: string): Promise<Result> {
  return new Promise(resolve => {
    const worker = new Worker(new URL('./search.worker.ts', import.meta.url), { type: 'module' })
    const finish = (result: Result) => { clearTimeout(timer); worker.terminate(); resolve(result) }
    const timer = setTimeout(() => finish({ id, path: [], error: 'Search exceeded 5 seconds. The existing algorithm needs review.' }), 5000)
    worker.onmessage = event => finish({ ...event.data, id })
    worker.onerror = () => finish({ id, path: [], error: 'Search failed. Check the algorithm implementation.' })
    worker.postMessage({ map, start, goal, id })
  })
}

export function validateMap(value: unknown): MapData {
  if (!value || typeof value !== 'object') throw Error('The JSON must contain a map object.')
  const map = value as MapData
  if (typeof map.name !== 'string' || !map.name.trim() || map.unit !== 'km' || !Array.isArray(map.cities) || !map.cities.length || !Array.isArray(map.roads)) throw Error('Provide a name, unit "km", cities and roads.')
  const names = new Set<string>()
  for (const city of map.cities) {
    if (!city || typeof city.name !== 'string' || !city.name.trim() || names.has(city.name) || !Number.isFinite(city.x) || !Number.isFinite(city.y)) throw Error('Cities need unique names and finite x/y coordinates.')
    names.add(city.name)
  }
  for (const road of map.roads) {
    if (!road || !names.has(road.from) || !names.has(road.to) || !Number.isFinite(road.km) || road.km < 0) throw Error('Roads must connect existing cities and have non-negative distances.')
  }
  return map
}
