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

export class BaseTask {}
export class PrimitiveTask extends BaseTask {
    public readonly name: string;
    private preconditions: Condition[] = [];
    public readonly effects: Condition[] = [];
    private onExecute: () => TaskResult;
    private message: string;
    constructor(name: string, preconditions: Condition[], effects: Condition[], message: string, onExecute: () =>TaskResult) {
        super();
        this.name = name;
        this.preconditions = preconditions;
        this.effects = effects;
        this.message = message;
        this.onExecute = onExecute;
    }
    IsAvailable(worldState: WorldState): boolean { return worldState.CheckConditions(this.preconditions); }
    // huom: applyeffects, pitäiskö tämmöstä ees olla oikeesti? tai tää oli planning exclusive funktio
    // VAI tarviiks tälle omaa funktioo ees? jos tää on planning only nii voisko ton WS update kutsuu ilman tätä
    // req ois se et ois effects getter tai effects ois public(public readonly?)
    ApplyEffects(worldState: WorldState) { worldState.UpdateWorldState(this.effects); }
    Execute(): TaskResult { 
        LOGGER.logDev('Executing task ' + this.name);
        LOGGER.logTask(this.message);
        return this.onExecute();
    }
    GetPreconditions(): Condition[] { return this.preconditions }
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