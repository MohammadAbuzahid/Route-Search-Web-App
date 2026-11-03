
import type { MapData } from "../types/map";

export function dfs(MapData: MapData, start: string, goal: string) {

    const stack: { city: string; path: string[]; cost: number }[] = [];

    const visited = new Set<string>();

    let steps = 0;

    stack.push({
        city: start,
        path: [start],
        cost: 0
    });

    while (stack.length > 0) {

        const current = stack.pop()!;

        if (visited.has(current.city)) {
            continue;
        }

        // Goal test
        if (current.city === goal) {
            return {
                path: current.path,
                cost: current.cost,
                steps: steps
            };
        }

        visited.add(current.city);
        steps++;

        // Get neighboring cities
        const childs = MapData.roads
            .filter((road) =>
                road.from === current.city ||
                road.to === current.city
            )
            .map((road) => {
                if (road.from === current.city) {
                    return {
                        city: road.to,
                        km: road.km
                    };
                } else {
                    return {
                        city: road.from,
                        km: road.km
                    };
                }
            })
            .sort((a, b) => a.city.localeCompare(b.city));

        // Add children to stack in reverse order
        for (let i = childs.length - 1; i >= 0; i--) {

            const child = childs[i];

            if (!visited.has(child.city)) {

                stack.push({
                    city: child.city,
                    path: [...current.path, child.city],
                    cost: current.cost + child.km
                });
            }
        }
    }

    return {
        path: [],
        cost: 0,
        steps: steps
    };
}
