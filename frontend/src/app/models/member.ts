import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';

export enum Role {
    Member = 0,
    Manager = 1,
    Admin = 2
}

export class Member {
    pseudo?: string;
    password?: string;
    fullName?: string;
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value) : value, { toClassOnly: true })
    birthDate?: Moment;
    role: Role = Role.Member;
    token?: string;

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
