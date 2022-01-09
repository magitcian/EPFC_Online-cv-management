import { Category } from "./category";
import { Mastering } from './mastering';
import { Using } from './using';

export class Skill {
    id : number = 0;
    name?: string;
    categoryId?: number;
    category?: Category;
    masteringSkillsLevels?: Mastering[] = [];
    usings?: Using[] = [];

    get display(): string {
        return `${this.name} - ${this.category?.name}`;
        // return `${this.category?.name}: ${this.name} - ${this.mastering?.level}`;
    } 

}