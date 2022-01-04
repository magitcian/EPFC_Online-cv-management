import { Injectable } from "@angular/core";
import { MatTableState } from "../helpers/mattable.state";

@Injectable({ providedIn: 'root' })
export class StateService {
    public userListState = new MatTableState('lastName', 'asc', 5);
    public masteringListState = new MatTableState('level', 'desc', 5);
    public skillOrEnterpriseListState = new MatTableState('name', 'asc', 5);    // name needs to be defined in the skill.ts and enterprise.Ts
}
