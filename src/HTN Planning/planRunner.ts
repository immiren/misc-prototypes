import { LOGGER } from "..";
import { PrimitiveTask, TaskResult } from "./tasks";
import { WorldState } from "./worldState";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    // public plan: PrimitiveTask[] = [];

    ExecutePlan(plan: PrimitiveTask[], worldState: WorldState) {
        console.log('plan len ' + plan.length);
        for(const task of plan) {
            if (worldState.CheckConditions(task.GetPreconditions())) {
                const result = task.Execute();
                if(result === TaskResult.SUCCESS) task.ApplyEffects(worldState);
                else if (result === TaskResult.FAILURE) {
                    LOGGER.logDev('Failed task ' + task.name);
                    // this.ClearPlan(); // tarviiks tätä ees? missä plan säilytetää
                    return;
                }
            } else {
                LOGGER.logDev('Conditions unmet at task ' + task.name);
                return;
            }
        }
    }
    ClearPlan() { }
    SetPlan() { }
}