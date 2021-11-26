// import { Type } from "class-transformer";
import { EventListenerFocusTrapInertStrategy } from "@angular/cdk/a11y";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';
import { Enterprise } from "./enterprise";
import { User } from "./user";

export enum Grade {
    Senior = 0, Expert = 1, Junior = 2
  }
  
export class Experience {

    id?: number;
    start?: Moment;
    finish?: Moment;
    title?: string;
    description?:string;
    enterprise?: Enterprise;
    user?:User;
    //skills: Skill[] = []; //plus tard
 
    get display(): string {
        return `${this.title} - ${this.description} - ${this.enterprise?.name}`;
    } 


}
