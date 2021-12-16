// import { Type } from "class-transformer";

import 'reflect-metadata';
import { User } from "./user";
import { Manager } from "./manager";
import * as _ from 'lodash-es';

  
export class Consultant extends User {

    managerId?: number;
    manager?: Manager;

}
