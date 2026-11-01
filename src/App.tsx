import { useRef, useState } from 'react'
import './App.css'
import defaultMap from './data/westbank_map.json'
import type { MapData } from './types/map'
import { algorithms, runSearch, validateMap } from './search-client'
import type { Result } from './search-client'
import MapView from './components/MapView'
import SearchForm from './components/SearchForm'
import Results from './components/Results'

function App() {
  const [map, setMap] = useState<MapData>(defaultMap)
  const [start, setStart] = useState('Jenin')
  const [goal, setGoal] = useState('Hebron')
  const [algorithm, setAlgorithm] = useState('ucs')
  const [results, setResults] = useState<Result[]>([])
  const [active, setActive] = useState('ucs')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const upload = useRef<HTMLInputElement>(null)
  const selected = results.find(result => result.id === active)
  const clear = () => { setResults([]); setError('') }
  const loadMap = (next: MapData) => {
    setMap(next); setStart(next.cities[0].name); setGoal(next.cities.at(-1)!.name); clear()
  }
  async function search(compare: boolean) {
    setBusy(true); setError(''); setResults([])
    try {
      const nextResults = compare
        ? await Promise.all(algorithms.map(item => item.ready
          ? runSearch(map, start, goal, item.id)
          : Promise.resolve<Result>({ id: item.id, path: [], error: 'Not connected yet' })))
        : [await runSearch(map, start, goal, algorithm)]
      setResults(nextResults)
      setActive(algorithm)
    } catch { setError('Unable to start search. Please try again.') }
    finally { setBusy(false) }
  }
  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="#"><span className="brand-icon">↗</span> Route<span className="brand-light">Lab</span></a><span className="course">AI / SEARCH STRATEGIES</span><span className="local-badge"><i /> Local workspace</span></header>
      <main>
        <section className="intro"><div><p className="eyebrow">EXPLORE. SEARCH. COMPARE.</p><h1>Every route starts with a question.</h1><p>Explore a road network and see how search strategies find their way.</p></div><span className="assignment">01<span>Route search lab</span></span></section>
        <div className="workspace">
          <aside className="panel controls"><div className="panel-heading"><span className="eyebrow">01 / CONFIGURE</span><h2>Plan your route</h2></div>
            <SearchForm cities={map.cities} start={start} goal={goal} algorithm={algorithm} busy={busy} onStart={value => { setStart(value); clear() }} onGoal={value => { setGoal(value); clear() }} onAlgorithm={value => { setAlgorithm(value); clear() }} onSwap={() => { setStart(goal); setGoal(start); clear() }} onSearch={() => void search(false)} onCompare={() => void search(true)} />
            <div className="dataset"><span className="eyebrow">MAP DATA</span><h3>{map.name}</h3><p>{map.cities.length} cities <span>·</span> {map.roads.length} two-way roads</p><input ref={upload} type="file" accept=".json,application/json" aria-label="Upload map JSON" disabled={busy} hidden onChange={async event => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { loadMap(validateMap(JSON.parse(await file.text()))) } catch (e) { setError(e instanceof Error ? e.message : 'Unable to read map.') } }} /><button className="secondary full" disabled={busy} onClick={() => upload.current?.click()}>↑ Upload JSON map</button><button className="text-button" disabled={busy} onClick={() => loadMap(defaultMap)}>Restore default map</button></div>
          </aside>
          <section className="panel map-panel"><div className="map-heading"><div><span className="eyebrow">02 / EXPLORE</span><h2>Road network</h2></div><span className="chip">Distances in km</span></div><MapView map={map} start={start} goal={goal} path={selected?.path ?? []} /><div className="legend"><span><i className="dot start" /> Start</span><span><i className="dot goal" /> Goal</span><span><i className="route-line" /> Selected route</span><span className="map-note">Schematic map · coordinates in km</span></div></section>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <Results results={results} active={active} busy={busy} onSelect={setActive} />
        <footer><span>ROUTELAB <span className="footer-divider">/</span> Search strategy workspace</span><span>Front-end integration · algorithms under development</span></footer>
      </main>
    </div>
  )
}
export default App
