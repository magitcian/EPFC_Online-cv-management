import { forEach } from "lodash";
import { Skill } from "./skill";

export class Category {
    id : number = 0; // TODO: maybe "BigInteger" is more appropriate
    name?: string;
    skills?: Skill[] = [];

    get display(): string {
        return `${this.name}`;
    } 

    get displaySkills(): string {
        var allSkills = "";
        this.skills?.forEach(skill => { 
            var levels = ""; 
            skill.masteringSkillsLevels?.forEach(m => {
                levels += m.level?.toString();
            })
            allSkills += skill.name + " - " + levels + ", ";
        }); 
        allSkills = allSkills.substring(0, allSkills.length - 2);
        return allSkills;
    } 

    get displaySkillsInExperiences(): string {
        var allSkills = "";
        this.skills?.forEach(skill => { 
            allSkills += skill.name + ", ";
        }); 
        allSkills = allSkills.substring(0, allSkills.length - 2);
        return allSkills;
    } 

}