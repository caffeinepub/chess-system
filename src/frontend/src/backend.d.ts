import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Player = {
    __kind__: "anonymous";
    anonymous: null;
} | {
    __kind__: "named";
    named: {
        xp: bigint;
        name: string;
        rank: ChessRank;
        level: bigint;
        skills: Skills;
    };
};
export interface Skills {
    calculation: bigint;
    timeManagement: bigint;
    endgameTechnique: bigint;
    openingKnowledge: bigint;
    patternRecognition: bigint;
}
export enum ChessRank {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    S = "S",
    National = "National",
    Monarch = "Monarch",
    Absolute = "Absolute"
}
export interface backendInterface {
    createPlayer(name: string): Promise<string>;
    getAllPlayers(): Promise<Array<Player>>;
    getPlayer(playerId: string): Promise<Player>;
}
