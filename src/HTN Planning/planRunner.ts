import { LOGGER } from "..";
import { PrimitiveTask, TaskResult } from "./tasks";
import { WorldState } from "./worldState";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    // public plan: PrimitiveTask[] = [];

    ExecutePlan(plan: PrimitiveTask[], worldState: WorldState) {
        LOGGER.logDev('PLAN EXECUTION START -----------------');
        LOGGER.logDev('plan len ' + plan.length);
        for(const task of plan) {
            if (worldState.CheckConditions(task.GetPreconditions())) {
                const result = task.Execute();
                if(result === TaskResult.SUCCESS) task.ApplyEffects(worldState);
                else if (result === TaskResult.FAILURE) {
                    LOGGER.logDev('FAIL Failed task ' + task.name);
                    LOGGER.logDev('PLAN EXECUTION END -----------------');
                    // this.ClearPlan(); // tarviiks tätä ees? missä plan säilytetää
                    return;
                }
            } else {
                LOGGER.logDev('FAIL Conditions unmet at task ' + task.name);
                LOGGER.logDev('PLAN EXECUTION END -----------------');
                return;
            }
        }
        LOGGER.logDev('PLAN EXECUTION END -----------------');
    }
    ClearPlan() { }
    SetPlan() { }
}