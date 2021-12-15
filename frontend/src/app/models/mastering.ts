import { User } from "./user";
import { Skill } from "./skill";

export class Mastering {
    id?: number; // TODO: maybe "BigInteger" is more appropriate
    level?: Level = Level.Starter;
    user?: User;
    skill?: Skill;
    userId?: number;
    skillId?: number;

    get display(): string {
        return "";
        // TODO return `${this.name} - ${this.mastering?.level}`;
        // return `${this.category?.name}: ${this.name} - ${this.mastering?.level}`;
    } 

}

export enum Level {
    Starter = 1,
    Junior = 2,
    Medior = 3,
    Senior = 4, 
    Expert = 5
}