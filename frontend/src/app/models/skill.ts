import { Category } from "./category";
import { Mastering } from './mastering';


export class Skill {
    id : number = 0; // TODO: maybe "BigInteger" is more appropriate
    name?: string;
    category?: Category;
    masteringSkillsLevels?: Mastering[] = [];

    get display(): string {
        return `${this.name} - ${this.category?.name}`;
        // return `${this.category?.name}: ${this.name} - ${this.mastering?.level}`;
    } 

}