import type {MapData} from "../types/map"

export function bfs(MapData : MapData, start: string, goal: string){

    const chelldren:string[] = [start];
    const visited = new Set<string>();
    visited.add(start);

    while(chelldren.length > 0){
        const current  = chelldren.shift()!;
        if(current  === goal){
            console.log("Chell done")
            break;
        }

        const chileds = MapData.roads.filter((road)=> road.from === current  || road.to === current )
            .map((road)=> {
                if (road.from === current ){
                    return road.to;
                }else {
                    return road.from;
                }
            })
        for (const chiled of chileds){
            if (!visited.has(chiled)){
                visited.add(chiled);
                chelldren.push(chiled)
            }
        }
        console.log("current = ",current );
        console.log("chelldren= ",chelldren)
    }
}
