// import { Type } from "class-transformer";

import 'reflect-metadata';
import { User } from "./user";
import { Consultant } from "./consultant";
import * as _ from 'lodash-es';

  
export class Manager extends User {

    consultant: Consultant[] = [];

}
