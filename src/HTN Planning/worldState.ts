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
    // cleared joka loop?
    private updatedKeys: eCondition[] = [];
    // oliks tää mikä? rename idk
    private elements: {
        index: number,
        elements: HTMLElement[]
    }[] = [];

    constructor(facts?: Condition[]) {
        // HUOM janky. varmista et nää on järjestyksessä,,,,,,
        // LOGGER.logDev('constructing ws');

        this.conditions = [
            {
                key: eCondition.vTargetLocation,
                value: facts ? facts[eCondition.vTargetLocation].value : null
            },
            {
                key: eCondition.bSeesTarget,
                value: facts ? facts[eCondition.bSeesTarget].value : false
            },
            {
                key: eCondition.bTestValue,
                value: facts ? facts[eCondition.bTestValue].value : false
            }
        ];

        // this.conditions.forEach((c) => {
        //     LOGGER.logDev('Added condition ' + eCondition[c.key] + ': ' + c.value);
        // })
    }

    /**
     * Checks if a list of conditions is met
     * @param preconditions 
     * @returns 
     */
    CheckConditions(preconditions: Condition[]): boolean {
        for (const precondition of preconditions) {
            // LOGGER.logDev('Checking if ' + eCondition[precondition.key] + ' is ' + precondition.value);
            const condition = this.conditions[precondition.key]; // jos ei toimi nii tarkista conditions järkkä................
            // LOGGER.logDev('CHECK is ' + eCondition[condition.key] + ' = ' + eCondition[precondition.key]);
            // LOGGER.logDev('Condition ' + eCondition[condition.key] + ' is ' + condition.value);

            if (!condition || condition.value !== precondition.value) {
                LOGGER.logDev('Precondition ' + eCondition[precondition.key] + ' = ' + condition.value + ' not found/unmet.');
                return false;
            }
            LOGGER.logDev('Precondition ' + eCondition[precondition.key] + ' = ' + condition.value + ' met.');
        }
        LOGGER.logDev('All ' + preconditions.length + ' conditions met.');
        return true;
    }
    /**
     * Updates WS & lisää päivitetyt arvot listaan
     * @param facts 
     */
    UpdateWorldState(facts: Condition[]) {
        for (const fact of facts) {
            // onks tää shallow copy vai? onks sillä välii tässä
            const condition = this.conditions[fact.key];
            if (!condition) {
                LOGGER.logDev('Condition ' + eCondition[fact.key] + ' not found in world state');
                continue;
            }

            LOGGER.logDev('Updating ' + eCondition[fact.key] + ' from ' + condition.value + ' to ' + fact.value);
            // shallow copy: world state ei varmana päivity :(
            this.conditions[fact.key] = fact;
            this.updatedKeys.push(fact.key);
            // TODO html update
        }
    }

    GetWorldState(): Condition[] { return this.conditions; }

    /**
     * Called once per update by creature. Clears updatedKeys
     * @returns updated condition keys
     */
    GetWorldStateUpdates(): eCondition[] {
        const keys = this.updatedKeys;
        this.updatedKeys = [];
        return keys;
    }

    GetCopyOfWorldState(): WorldState {
        LOGGER.logDev('Copying WS');
        const ws = new WorldState(this.conditions);
        // ws.updateWorldStateView(); // what
        return ws;
    }
    SetupWorldState() {
    }
    GetValue(fact: Condition): Condition | undefined {
        return;
    }

    // UI UPDATES -------------------
    updateWorldStateView() {
        const wsdiv = document.getElementById("worldState");
        if (!wsdiv) {
            LOGGER.logDev('no wsdiv found');
            throw new Error('no wsdiv found');
        }
        for (let i = 0; i < this.conditions.length; i++) {
            const e = document.createElement("p");
            e.textContent = eCondition[this.conditions[i].key].toString();
            LOGGER.logDev('a ' + eCondition[this.conditions[i].key] + ', ' + eCondition[this.conditions[i].key][0] + ', ' + eCondition[this.conditions[i].key].toString() + ', ' + eCondition[this.conditions[i].key].toString()[0]);
            switch (eCondition[this.conditions[i].key].toString()[0]) {
                case "b":
                    LOGGER.logDev('Making a boolean ' + eCondition[this.conditions[i].key]);
                    const checkboxElement = document.createElement("input");
                    checkboxElement.type = "checkbox";
                    checkboxElement.id = eCondition[i];
                    if (this.conditions[i].value == false) {
                        checkboxElement.checked = false;
                    } else if (this.conditions[i].value == true) {
                        checkboxElement.checked = true;
                    } else {
                        LOGGER.logDev('WS flagged as boolean incorrectly? ' + eCondition[this.conditions[i].key]);
                    }
                    e.appendChild(checkboxElement);
                    break;
                case "v":
                    LOGGER.logDev('Making a vector ' + eCondition[this.conditions[i].key]);
                    const box1 = document.createElement("input");
                    const text1 = document.createElement("p");
                    const box2 = document.createElement("input");
                    const text2 = document.createElement("p");
                    const box3 = document.createElement("input");
                    const text3 = document.createElement("p");
                    box1.type = "text";
                    box2.type = "text";
                    box3.type = "text";
                    box1.value = "12";
                    box2.value = "23";
                    box3.value = "34";
                    text1.textContent = "x:";
                    text2.textContent = "y:";
                    text3.textContent = "z:";
                    e.append(text1);
                    e.append(box1);
                    e.append(text2);
                    e.append(box2);
                    e.append(text3);
                    e.append(box3);
                    break;
            }
            wsdiv.appendChild(e);

        }
    }
    updateWSFromView() { }
}

// kato läpi missä on fiksuin paikka millekkin, varsinki ws updateille