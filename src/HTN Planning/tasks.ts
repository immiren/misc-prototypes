// export class Task {
//     constructor(tasks, onRun) {
//         this.tasks = tasks;
//         this.onRun = onRun;
//     }
//     onRun() {
//         this.onRun();
//     }
// }

import { LOGGER } from "..";
import { Condition, WorldState } from "./worldState";

export enum TaskResult {
    SUCCESS,
    FAILURE,
    WAITING
}

export class BaseTask { }
export class PrimitiveTask extends BaseTask {
    public readonly name: string;
    private preconditions: Condition[] = [];
    public readonly effects: Condition[] = [];
    private onExecute: () => TaskResult;
    // rename ehkä? on delete tai on destruct jne
    private onClear: () => void;
    constructor(name: string, preconditions: Condition[], effects: Condition[], onExecute: () => TaskResult, onClear: () => void) {
        super();
        this.name = name;
        this.preconditions = preconditions;
        this.effects = effects;
        this.onExecute = onExecute;
        this.onClear = onClear;
    }
    /**
     * 
     * @param worldState 
     * @returns 
     */
    IsAvailable(worldState: WorldState): boolean { return worldState.CheckConditions(this.preconditions); }
    // huom: applyeffects, pitäiskö tämmöstä ees olla oikeesti? tai tää oli planning exclusive funktio
    // VAI tarviiks tälle omaa funktioo ees? jos tää on planning only nii voisko ton WS update kutsuu ilman tätä
    // req ois se et ois effects getter tai effects ois public(public readonly?)
    ApplyEffects(worldState: WorldState) { worldState.UpdateWorldState(this.effects); }
    Execute(): TaskResult {
        LOGGER.logDev('Executing task ' + this.name);
        return this.onExecute();
    }
    GetPreconditions(): Condition[] { return this.preconditions }
    ClearTask() {
        this.onClear();
    }
}

export class CompoundTask extends BaseTask {
    private methods: Method[];
    constructor(methods: Method[]) {
        super();
        this.methods = methods;
    }
    GetMethods(): Method[] { return this.methods }
}

export type Method = {
    tasks: BaseTask[];
    preconditions: Condition[];
}