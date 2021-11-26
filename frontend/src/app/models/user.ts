import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';
import { Experience } from "./experience";

export enum Title {
    AdminSystem = 0,
    SeniorManager = 1,
    MediorManager = 2,
    JuniorManager = 3, 
    SeniorConsultant = 4, 
    MediorConsultant = 5, 
    JuniorConsultant = 6
  }
 
  
export class User {
    id?: BigInteger;
    lastName?: string;
    firstName?: string;
    email?: string;
    password?: string;
    // décorateur pour faire fonctionner "this.birthDate.getFullYear" 
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    birthDate?: Moment;
    experiences: Experience[] = [];
    title: Title = Title.JuniorConsultant;
    token?: string;

    public get titleAsString(): string {
        return Title[this.title];
    }
    
    get display(): string {
        return `${this.firstName} ${this.lastName} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    } 

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = moment();
        return today.diff(this.birthDate, 'years');
    }

}
