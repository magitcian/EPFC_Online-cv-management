import { User } from "./user";
import { Skill } from "./skill";

export class Mastering {
    id?: number; 
    level?: Level; // = Level.Starter;
    user?: User;
    skill?: Skill;
    userId?: number;
    skillId?: number;

    get display(): string {
        return "";
    } 

}

export enum Level {
    Starter = 1,
    Junior = 2,
    Medior = 3,
    Senior = 4, 
    Expert = 5
}