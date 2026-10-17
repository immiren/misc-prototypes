// export type Condition = {eCondition: boolean | number | string | (number | string)[]} 
export type Condition = {
    name: eCondition,
    value: boolean | number | string | (number | string)[] //etc
}

export enum eCondition {
    vTargetLocation,
    bSeesTarget,
    bTestValue
}

export class WorldState {
    private conditions: Condition[] = [];
    CheckConditions(preconditions: Condition[]): boolean { return true; }
    UpdateWorldState(facts: Condition[]) {
        facts.forEach((fact) => {
            // if (this.conditions.includes(fact)) { }
            console.log('Updating ' + fact);
            //  + ' from ' + this.conditions.find(key))
        })
    }
    GetWorldState(): Condition[] { return []; }
    GetCopyOfWorldState() { }
    SetupWorldState() { }
    GetValue(fact: Condition): Condition | undefined {
        return;
    }
}

// kato läpi missä on fiksuin paikka millekkin, varsinki ws updateille