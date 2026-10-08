import { PrimitiveTask, TaskResult } from "./tasks";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    // public plan: PrimitiveTask[] = [];

    ExecutePlan(plan: PrimitiveTask[]) {
        console.log('plan len ' + plan.length);
        for(const task of plan) {
            console.log('executing task ');
            task.Execute();
        }
    }
    ClearPlan() { }
    SetPlan() { }
}