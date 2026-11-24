
import type { MapData } from "../types/map";

// Calculate heuristic distance between two cities
function heuristic(
    mapData: MapData,
    city1: string,
    city2: string
): number {

    const firstCity = mapData.cities.find(
        (city) => city.name === city1
    );

    const secondCity = mapData.cities.find(
        (city) => city.name === city2
    );

    if (!firstCity || !secondCity) {
        return 0;
    }

    const dx = firstCity.x - secondCity.x;
    const dy = firstCity.y - secondCity.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    return Math.floor(distance);
}

export function astar(
    mapData: MapData,
    start: string,
    goal: string
) {

    const frontier: {
        city: string;
        path: string[];
        cost: number;
    }[] = [];

    const visited = new Set<string>();

    let steps = 0;

    frontier.push({
        city: start,
        path: [start],
        cost: 0
    });

    while (frontier.length > 0) {

        // Sort by f(n) = g(n) + h(n)
        frontier.sort((a, b) => {

            const f1 = a.cost + heuristic(mapData, a.city, goal);
            const f2 = b.cost + heuristic(mapData, b.city, goal);

            if (f1 !== f2) {
                return f1 - f2;
            }

            return a.city.localeCompare(b.city);
        });

        const current = frontier.shift()!;

        if (visited.has(current.city)) {
            continue;
        }

        // Goal test when removed from frontier
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
        const children = mapData.roads
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
            });

        for (const child of children) {

            if (!visited.has(child.city)) {

                frontier.push({
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
