import type { MapData } from "../types/map";

type UCSNode = {
    city: string;
    cost: number;
    path: string[];
};

export function ucs(
    MapData: MapData,
    start: string,
    goal: string
) {

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
        console.log("Current city:", current.city);
        console.log("Current cost:", current.cost);
        console.log("Current path:", current.path);
        if (current.city === goal) {
            return {
                path: current.path,
                cost: current.cost
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
        cost: Infinity
    };
}