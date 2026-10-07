import { BaseTask, CompoundTask, Method } from "./tasks";
import { WorldState } from "./worldState";

export class Planner {
    private worldStateStack: WorldState[] = [];
    private activeWorldState: WorldState;
    private rootTask: CompoundTask;
    constructor(rootTask: CompoundTask) {
        this.rootTask = rootTask;
        this.activeWorldState = new WorldState();
    }
    Plan(worldState: WorldState): BaseTask[] {
        this.InitialiseCurrentWorkingState(worldState);
        const decomposedPlan = this.DecomposeCompoundTask(this.rootTask);
        if (decomposedPlan.length > 0) {
            console.log('planning succesful. plan length ' + decomposedPlan.length);
            return decomposedPlan;
        } else {
            console.log('planning failed.');
            return [];
        }
    }
    DecomposeCompoundTask(task: CompoundTask): BaseTask[] { return []; }
    DecomposeMethodTasks(method: Method): BaseTask[] { return []; }
    InitialiseCurrentWorkingState(worldState: WorldState) {
        this.worldStateStack.length = 0;
        // this.worldStateStack.pop(worldState.GetCopyOfWorldState());
    }
    RestorePreviousWorkingState() { }
    SaveCurrentWorkingState() { }
    GetCopyOfCurrentWorkingState() { }
    // DomainSetup() {}
    RemoveWorkingState() { }
    GetIndexOfSafeWorldState() { }

}