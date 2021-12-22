import { Experience } from "./experience";
import { Skill } from "./skill";

export class Using {
    id?: number; 

    experience?: Experience;
    skill?: Skill;
    experienceId?: number;
    skillId?: number;


    get display(): string {
        return "";
    } 


    addSkill(skill: Skill, experience : Experience){
        this.id = 0;
        this.skill = skill;
        this.skillId = skill?.id;
        //this.experience = experience; //sinon problème de sérialisation : RangeError: Maximum call stack size exceeded
        this.experienceId = experience?.id;
    }

}
