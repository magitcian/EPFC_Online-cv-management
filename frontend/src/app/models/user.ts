import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';
import { Experience } from "./experience";
import { Mastering } from "./mastering";

export enum Title {
    AdminSystem = 0,
    Manager = 1,
    Consultant = 2
  }
 
  
export class User {
    id : number = 0; // TODO: maybe "BigInteger" is more appropriate
    lastName?: string;
    firstName?: string;
    email?: string;
    password?: string;
    // décorateur pour faire fonctionner "this.birthDate.getFullYear" 
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    birthDate?: Moment;
    experiences: Experience[] = [];
    masterings: Mastering[] = [];
    title: Title = Title.Consultant;
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
