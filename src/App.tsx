/*
import { useState } from 'react'
*/

import './App.css'
import westbankMap from "../src/data/westbank_map.json"
import {bfs} from '../src/algorithms/bfs'
import type {MapData} from "./types/map.ts";

function App() {
  const mapData: MapData = westbankMap;

  const handleSearch = () => {
    const result = bfs(mapData, "Nablus", "Hebron");

    console.log(result);
  };

  return (
      <div>
        <button onClick={handleSearch}>
          Run DFS
        </button>
      </div>
  );
}

export default App;