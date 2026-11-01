/*
import { useState } from 'react'
*/

import './App.css'
import westbankMap from "../src/data/westbank_map.json"
//import {bfs} from '../src/algorithms/bfs'
import type {MapData} from "./types/map.ts";
import {ucs} from "./algorithms/ucs.ts";

function App() {
  const mapData: MapData = westbankMap;

  const handleSearch = () => {
    //const result = bfs(mapData, "Nablus", "Hebron");
    const result2 = ucs(mapData, "Tulkarm", "Tubas");
    //console.log(result);
    console.log(result2);
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