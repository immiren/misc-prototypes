import { LOGGER } from "..";
import { PrimitiveTask, TaskResult } from "./tasks";
import { WorldState } from "./worldState";

export class PlanRunner {
    public status: TaskResult = TaskResult.SUCCESS;
    private currentTask: PrimitiveTask | null = null;
    private currentTaskIndex: number | null = null;
    private plan: PrimitiveTask[] = [];

    ExecutePlan(worldState: WorldState) {
        if (!this.HasPlan()) {
            LOGGER.logDev('Attempted to execute plan without plan set. returning');
            return;
        }
        if (!this.currentTask) {
            LOGGER.logDev('Attempted to execute plan without current task set. returning');
            return;
        }
        if (!this.currentTaskIndex) {
            LOGGER.logDev('NO TASK INDEX WITH CURRENT TASK. returning');
            return;
        }

        if (!this.currentTask.IsAvailable(worldState)) {
            LOGGER.logDev('Task ' + this.currentTask.name + ' unavailable. Clearing plan.');
        }
        const taskResult = this.currentTask.Execute();
        switch (taskResult) {
            case TaskResult.SUCCESS:
                // huom ei tätä lopulliseen versioon! prototype only juttu
                this.currentTask.ApplyEffects(worldState);
                // move to next task 
                this.updateCurrentTask();
                break;
            case TaskResult.WAITING:
                break;
            case TaskResult.FAILURE:
                LOGGER.logDev('FAIL Failed task ' + this.currentTask.name);
                LOGGER.logDev('PLAN EXECUTION END -----------------');
                this.ClearPlan();
                // vai return?
                break;
        }

        // if (!this.currentTask && !this.currentTaskIndex) {
        //     LOGGER.logDev('PLAN EXECUTION START -----------------');
        //     // currentindex tuntuu vähä tyhmält ja tää koko plan rakenne muutenki.
        //     // TODO: vaiha plan [] johonki mikä toimii täs oikein
        //     this.currentTaskIndex = this.plan.length - 1;

        //     this.currentTask = this.plan[this.currentTaskIndex];
        //     LOGGER.logDev('Beginning task from task ' + this.currentTask.name + ' at index ' + this.currentTaskIndex);
        // }
        // this.currentTask?.Execute();

        // used plan: PrimitiveTask[] as input
        // for (const task of plan) {
        //     if (worldState.CheckConditions(task.GetPreconditions())) {
        //         const result = task.Execute();
        //         if (result === TaskResult.SUCCESS) task.ApplyEffects(worldState);
        //         else if (result === TaskResult.FAILURE) {
        //             LOGGER.logDev('FAIL Failed task ' + task.name);
        //             LOGGER.logDev('PLAN EXECUTION END -----------------');
        //             // this.ClearPlan(); // tarviiks tätä ees? missä plan säilytetää
        //             return;
        //         }
        //     } else {
        //         LOGGER.logDev('FAIL Conditions unmet at task ' + task.name);
        //         LOGGER.logDev('PLAN EXECUTION END -----------------');
        //         return;
        //     }
        // }
    }
    ClearPlan() {
        LOGGER.logDev('Clearing plan');
        this.currentTask?.ClearTask();
        this.currentTaskIndex = null;
        this.plan = [];
    }
    SetPlan(newPlan: PrimitiveTask[]) {
        this.plan = newPlan;
        this.updateCurrentTask(this.plan.length);
        LOGGER.logDev('Beginning plan from task ' + this.currentTask?.name + ' at index ' + this.currentTaskIndex);
    }
    HasPlan(): boolean {
        LOGGER.logDev('HasPlan() len ' + this.plan.length + ' current task ' + this.currentTask?.name + ' index ' + this.currentTaskIndex);
        return (this.plan.length > 0) && !!this.currentTask && !!this.currentTaskIndex;
    }

    /**
     * Updates current task and current task index
     * @param planLength provide on set plan only
     * @returns on error/incorrect information
     */
    private updateCurrentTask(planLength?: number) {
        let index = planLength ?? this.currentTaskIndex;
        if (!index) {
            LOGGER.logDev('No index set for task. plan length ' + this.plan.length + ', old index ' + this.currentTaskIndex);
            return;
        }
        if (this.plan.length <= 0) {
            LOGGER.logDev('Invalid plan length ' + this.plan.length);
            return;
        }
        index--;

        if (index >= this.plan.length) {
            LOGGER.logDev('Given index exceedes plan array. Index: ' + index + ' plan length ' + this.plan.length);
            return;
        }
        if (index < 0) {
            LOGGER.logDev('Subzero index. Index: ' + index + ' plan length ' + this.plan.length);
            return;
        }

        this.currentTask = this.plan[index];

        if (!this.currentTask) {
            LOGGER.logDev('No task found at index ' + index + ' of plan length ' + this.plan.length);
            this.ClearPlan();
            return;
        }

        LOGGER.logDev('New task: ' + this.currentTask.name + ' at plan index ' + index);
        // this.currentTaskIndex = index; // ei ehkä tarvii
    }

}
