import type {MapData} from "../types/map"

export function bfs(MapData : MapData, start: string, goal: string){

    const chelldren:string[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, string | null>();
    const path: string[] = [];
    let countPath = 0 ;

    let city: string | null = goal;

    parent.set(start, null);
    visited.add(start);

    while(chelldren.length > 0){
        const current  = chelldren.shift()!;
        if(current  === goal){
            while (city !== null) {
                path.push(city);
                city = parent.get(city) ?? null;
            }
            path.reverse();
            break;
        }

        const childs = MapData.roads.filter((road)=> road.from === current  || road.to === current )
            .map((road)=> {
                if (road.from === current ){
                    return road.to;
                }else {
                    return road.from;
                }
            }).sort();
        for (const child of childs){
            if (!visited.has(child)){
                visited.add(child);
                parent.set(child, current);
                chelldren.push(child)
            }
        }

        console.log("current = ",current );
        console.log("chelldren= ",chelldren)
    }


    for (let i = 0; i < path.length - 1; i++){
        const from = path[i];
        const to = path[i +1];

        const road = MapData.roads.find(
            (road) =>
                (road.from === from && road.to === to) ||
                (road.from === to && road.to === from)
        );

        if (road){
            countPath += road.km;
        }
    }



    console.log("parent: ", parent);
    console.log("path: ", path);
    console.log("cost =", countPath);
}
