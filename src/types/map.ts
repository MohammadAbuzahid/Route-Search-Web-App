export type MapData = {
    name: string;
    unit: string;
    cities: City[];
    roads: Road[];
}

export type City = {
    name: string;
    x: number;
    y: number;
}

export type Road = {
    from: string;
    to: string;
    km: number;
}