import { Planner } from "./HTN Planning/planner";
import { PlanRunner } from "./HTN Planning/planRunner";
import { CompoundTask, PrimitiveTask } from "./HTN Planning/tasks";
import { eCondition, WorldState } from "./HTN Planning/worldState";
import { LOGGER } from "./logger";

export class Creature {
    public planner: Planner;
    public planRunner: PlanRunner;
    public worldState: WorldState;
    private relevantConditions: eCondition[] = [];
    constructor(rootTask: CompoundTask) {
        this.worldState = new WorldState();
        this.planner = new Planner(rootTask, this.worldState);
        this.planRunner = new PlanRunner();
        this.Tick();
        this.worldState.UpdateWorldState([{ key: eCondition.bTestValue, value: true }]);
    }
    // tick vai update vai
    public Tick() {
        LOGGER.logDev('TICK --------------------')
        // World State Update
        // huom! tää saattaa olla turha, tutki miten toimii
        // const WSUpdates = this.worldState.GetWorldStateUpdates();
        // Check if relevant conditions have been updated
        // this.relevantConditions.forEach((key) => {
        //     if (WSUpdates.includes(key)) {
        //         LOGGER.logDev('Relevant ws entry has changed.');
        //         this.planRunner.ClearPlan();
        //         this.relevantConditions = [];
        //     }
        // })
        // TODO: keksi miten toimii plannerin kaa:
        // sen täytyy myös track näitä ja palauttaa relevant conditions

        // Planning Phase
        if (!this.planRunner.HasPlan()) {
            const newPlan = this.planner.Plan(this.worldState);
            // set plan
            this.planRunner.SetPlan(newPlan);
        }

        // Plan Execution Phase
        // executePlan()
        this.planRunner.ExecutePlan(this.worldState);
    }
}