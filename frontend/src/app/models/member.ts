// import { Type } from "class-transformer";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';

export enum Role {
    Admin = 0,
    Manager = 1,
    Member = 2
  }

export class Phone {
    phoneId?: number;
    type?: string; 
    number?: string;
}  
  
export class Member {
    pseudo?: string;
    password?: string;
    fullName?: string;
    // décorateur pour faire fonctionner "this.birthDate.getFullYear" 
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    birthDate?: Moment;
    role: Role = Role.Member;
    token?: string;
    phones: Phone[] = [];

    public get roleAsString(): string {
        return Role[this.role];
    }
    
    get display(): string {
        return `${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
    } 

    get age(): number | undefined {
        if (!this.birthDate)
            return undefined;
        var today = moment();
        return today.diff(this.birthDate, 'years');
    }

}
