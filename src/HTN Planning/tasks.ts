// export class Task {
//     constructor(tasks, onRun) {
//         this.tasks = tasks;
//         this.onRun = onRun;
//     }
//     onRun() {
//         this.onRun();
//     }
// }

import { Condition, WorldState } from "./worldState";

export enum TaskResult {
    SUCCESS,
    FAILURE,
    WAITING
}

export class BaseTask {}
export class PrimitiveTask extends BaseTask {
    private preconditions: Condition[] = [];
    private effects: Condition[] = [];
    private onExecute: () => TaskResult;
    constructor(preconditions: Condition[], effects: Condition[], onExecute: () =>TaskResult) {
        super();
        this.preconditions = preconditions;
        this.effects = effects;
        this.onExecute = onExecute;
    }
    IsAvailable(worldState: WorldState): boolean { return worldState.CheckConditions(this.preconditions); }
    ApplyEffects(worldState: WorldState) { worldState.UpdateWorldState(this.effects); }
    Execute(): TaskResult { return this.onExecute();}
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