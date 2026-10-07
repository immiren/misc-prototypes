import { PrimitiveTask, TaskResult } from "./tasks";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    public plan: PrimitiveTask[] = [];

    ExecutePlan() { }
    ClearPlan() { }
    SetPlan() { }
}