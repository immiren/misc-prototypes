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
    private effects: Condition[] = [];
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