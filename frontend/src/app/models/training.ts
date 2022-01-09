// import { Type } from "class-transformer";
import { EventListenerFocusTrapInertStrategy } from "@angular/cdk/a11y";
import * as internal from "assert";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";
import { Moment } from "moment";
import 'reflect-metadata';
import { Enterprise } from "./enterprise";
import { Experience } from "./experience";
import { User } from "./user";
import * as _ from 'lodash-es';

export enum Grade {
    SummaCumLaude = 0, MagnaCumLaude = 1, CumLaude = 2
}

export class Training extends Experience {
   
    grade!: Grade; 
    // grade: Grade = Grade.CumLaude;

    public get gradeAsString(): string {
        return Grade[this.grade];
    }


}
