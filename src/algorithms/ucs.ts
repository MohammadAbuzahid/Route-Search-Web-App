import type { MapData } from "../types/map";
import type { SearchResult } from "../types/search";

type UCSNode = {
    city: string;
    cost: number;
    path: string[];
};

export function ucs(
    MapData: MapData,
    start: string,
    goal: string
): SearchResult {

    const expanded = new Set<string>();
    let steps = 0;

    const frontier: UCSNode[] = [
        {
            city: start,
            cost: 0,
            path: [start]
        }
    ];

    while (frontier.length > 0) {

        frontier.sort((node1, node2) => {
            if (node1.cost !== node2.cost) {
                return node1.cost - node2.cost;
            }
            return node1.city.localeCompare(node2.city);
        });
        const current = frontier.shift()!;
        // Ignore duplicate frontier entries; count each processed city once.
        if (expanded.has(current.city)) continue;
        expanded.add(current.city);
        steps++;
        console.log("Current city:", current.city);
        console.log("Current cost:", current.cost);
        console.log("Current path:", current.path);
        if (current.city === goal) {
            return {
                path: current.path,
                cost: current.cost,
                steps
            };
        }
        const roads = MapData.roads.filter(
            (road) =>
                road.from === current.city ||
                road.to === current.city
        );

        for (const road of roads) {
            const child =
                road.from === current.city
                    ? road.to
                    : road.from;
            if (expanded.has(child)) continue;
            const newCost = current.cost + road.km;
            frontier.push({
                city: child,
                cost: newCost,
                path: [...current.path, child]
            });
        }
    }

    return {
        path: [],
        cost: Infinity,
        steps
    };
}
