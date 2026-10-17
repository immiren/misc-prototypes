import { Planner } from "./HTN Planning/planner";
import { PlanRunner } from "./HTN Planning/planRunner";
import { CompoundTask, PrimitiveTask } from "./HTN Planning/tasks";
import { WorldState } from "./HTN Planning/worldState";

export class Creature {
    public planner: Planner;
    public planRunner: PlanRunner;
    public worldState: WorldState;
    public plan: PrimitiveTask[] = [];
    constructor(rootTask: CompoundTask) {
        this.worldState = new WorldState();
        this.planner = new Planner(rootTask, this.worldState);
        this.planRunner = new PlanRunner();
    }
    
}