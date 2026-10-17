import { LOGGER } from "..";
import { PrimitiveTask, TaskResult } from "./tasks";
import { WorldState } from "./worldState";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    // public plan: PrimitiveTask[] = [];

    ExecutePlan(plan: PrimitiveTask[], worldState: WorldState) {
        console.log('plan len ' + plan.length);
        for(const task of plan) {
            if (worldState.CheckConditions(task.GetPreconditions())) task.Execute();
            else {
                LOGGER.logDev('Plan failed at task ' + task.name);
                return;
            }
        }
    }
    ClearPlan() { }
    SetPlan() { }
}