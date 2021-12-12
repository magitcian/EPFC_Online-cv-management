// import { Type } from "class-transformer";
import { EventListenerFocusTrapInertStrategy } from "@angular/cdk/a11y";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';
import { Enterprise } from "./enterprise";
import { User } from "./user";
import * as _ from 'lodash-es';
  
export class Experience {

    id?: number;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    start?: Moment;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    finish?: Moment;
    title?: string;
    description?:string;
    enterprise?: Enterprise;
    user?:User;
    //skills: Skill[] = []; //plus tard
 
    get display(): string {
        return `${this.title} - ${this.description} - ${this.enterprise?.name}`;
    } 

    get startDate(): any{
        return this.start ; //?.format('DD/MM/YYYY');
    }

    get finishDate(): any{
        return this.finish ; //?.format('DD/MM/YYYY');
    }


}
