import { LOGGER } from "..";

export enum eCondition {
    vTargetLocation,
    bSeesTarget,
    bTestValue
}

export type ConditionValue =
    | boolean
    | number
    | string
    | (number | string)[]
    | null;

// pahoin pelkään et tää ei toimi niin ku toivoin. testaile
export type Condition = {
    [K in eCondition]: { key: K; value: ConditionValue }
}[eCondition]

// erm figure out missä aktiivine ws ja kopiot on,,, 
export class WorldState {
    private conditions: Condition[] = [];
    constructor(facts?: Condition[]){
        this.conditions = [
            {
                key: eCondition.bSeesTarget,
                value: facts ? facts[eCondition.bSeesTarget].value : false
            },
            {
                key: eCondition.bTestValue,
                value: facts ? facts[eCondition.bTestValue].value : false
            },
            {
                key: eCondition.vTargetLocation,
                value: facts ? facts[eCondition.vTargetLocation].value : null
            }
        ];
        LOGGER.logDev('constructing ws');
        this.conditions.forEach((c) => {
            LOGGER.logDev(c.key + ': ' + c.value);
        })
    }
    CheckConditions(preconditions: Condition[]): boolean {
        for (const precondition of preconditions) {
            LOGGER.logDev('Checking if ' + precondition.key + ' is ' + precondition.value);
            const condition = this.conditions[precondition.key];
            LOGGER.logDev('Condition ' + condition.key + ' is ' + condition.value);
            if (!condition) {
                LOGGER.logDev('Precondition ' + precondition.key + ' not found/unmet.');
                return false;
            }
            LOGGER.logDev('Precondition ' + precondition.key + ' met.');
        }
        LOGGER.logDev('All ' + preconditions.length + ' conditions met.');
        return true; }
    UpdateWorldState(facts: Condition[]) {
        for (const fact of facts) {
            const condition = this.conditions[fact.key];
            if (!condition) {
                LOGGER.logDev('Condition ' + fact.key + ' not found in world state');
                continue;
            }

            LOGGER.logDev('Updating ' + fact.key + ' from ' + condition.value + ' to ' + fact.value);
            // shallow copy: world state ei varmana päivity :(
            this.conditions[fact.key] = fact;
            // TODO html update
        }
    }
    GetWorldState(): Condition[] { return this.conditions; }
    GetCopyOfWorldState(): WorldState {
        LOGGER.logDev('Copying WS');
        const ws = new WorldState();
        ws.UpdateWorldState(this.conditions);
        return ws;
    }
    SetupWorldState() {
    }
    GetValue(fact: Condition): Condition | undefined {
        return;
    }
}

// kato läpi missä on fiksuin paikka millekkin, varsinki ws updateille