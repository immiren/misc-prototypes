import { LOGGER } from "..";
import { CompoundTask, Method, PrimitiveTask } from "./tasks";
import { WorldState } from "./worldState";

// lisää world state updates
export class Planner {
    private worldStateStack: WorldState[] = [];
    private activeWorldState: WorldState;
    private rootTask: CompoundTask; // tän ei ehk pitäis olla tääl. onks planner npc-spesifi vai ei?
    constructor(rootTask: CompoundTask, worldState: WorldState) {
        this.rootTask = rootTask;
        this.activeWorldState = worldState;
    }
    Plan(worldState: WorldState): PrimitiveTask[] {
        LOGGER.logDev('PLANNING START -----------------');
        this.InitialiseCurrentWorkingState(worldState);
        const decomposedPlan = this.DecomposeCompoundTask(this.rootTask);
        if (decomposedPlan.length > 0) {
            LOGGER.logDev('planning succesful. plan length ' + decomposedPlan.length);
            LOGGER.logDev('PLANNING END -----------------');
            return decomposedPlan;
        } else {
            LOGGER.logDev('planning failed.');
            LOGGER.logDev('PLANNING END -----------------');
            return [];
        }
    }
    /**
     * Turns a compound task into a list of primitive tasks
     * @param task to be decomposed
     * @returns list of tasks or an empty list if no valid plan was found
     */
    DecomposeCompoundTask(task: CompoundTask): PrimitiveTask[] {
        LOGGER.logDev('decomposeCompoundTask');
        // miten world state updates täs
        const methods = task.GetMethods();
        const decomposedTasks: PrimitiveTask[] = []; 
        if(methods.length <= 0) {
            LOGGER.logDev('No methods found in task ' + task);
            throw new Error('No methods found in task ' + task);
        }

        const safeIndex = this.SaveCurrentWorkingState();

        // ettii yhen sopivan -> eteenpäi kunnes returns plan
        for(const method of methods) {
            LOGGER.logDev('assessing method');
            const tasks = this.DecomposeMethodTasks(method);
            if (tasks.length > 0) {
                decomposedTasks.push(...tasks);
                break;
            }
        }
        if (decomposedTasks.length === 0 ){
            LOGGER.logDev('DCT No tasks received. Returning to WSS index ' + safeIndex);
            this.RestorePreviousWorkingState(safeIndex);
        }
        return decomposedTasks;
    }
    
    // toimii jos kaikki toimii -> jokasen compound task täytyy return jotai
    DecomposeMethodTasks(method: Method): PrimitiveTask[] 
        {
            LOGGER.logDev('decomposeMethodTasks');
            const tasks = method.tasks;
            const decomposedTasks: PrimitiveTask[] = [];
            tasks.forEach((task) =>{
                if (task instanceof CompoundTask){
                    LOGGER.logDev('compound task');
                    const safeIndex = this.SaveCurrentWorkingState();
                    const newTasks = this.DecomposeCompoundTask(task);
                    if (newTasks.length > 0) {
                        LOGGER.logDev('Added ' + newTasks.length + ' tasks');
                        decomposedTasks.push(...newTasks);
                    } else {
                        // onko oikein?
                        LOGGER.logDev('no plan made. returning to WSS index ' + safeIndex);
                        this.RestorePreviousWorkingState(safeIndex);
                        return [];
                    }
                } else if (task instanceof PrimitiveTask){
                    LOGGER.logDev('primitive task');
                    const isAvailable = task.IsAvailable(this.worldStateStack[this.worldStateStack.length-1]);
                    if( isAvailable) {
                        LOGGER.logDev('Adding task ' + task.name + ' to plan');
                        // vertaa tää vs applyeffects
                        this.worldStateStack[this.worldStateStack.length-1].UpdateWorldState(task.effects);
                        // task.ApplyEffects(this.worldStateStack[this.worldStateStack.length-1]); // kertaa onks tää fiksu rakenne
                        decomposedTasks.push(task);
                    } else {
                        LOGGER.logDev('Task ' + task.name + ' unavailable.');
                        return [];
                    }
                }
            })
         return decomposedTasks;
        }
    InitialiseCurrentWorkingState(initialWorldState: WorldState) {
        this.worldStateStack.length = 0;
        this.worldStateStack.push(initialWorldState.GetCopyOfWorldState());
    }
    RestorePreviousWorkingState(safeIndex: number) {
        const targetLength = safeIndex + 1;
        let steps = this.worldStateStack.length -targetLength;
        LOGGER.logDev('Returning WSS to index ' + safeIndex + '. WSS len ' + this.worldStateStack.length + ', target len ' + targetLength + ' req steps ' + steps);
        if (steps <= 0) {
            LOGGER.logDev('Incorrect target & WSS lengths. ' + steps + ' steps.');
            throw new Error('Incorrect target & WSS lengths. ' + steps + ' steps.');
        }

        for (let i = 0; i < steps; i++){
            LOGGER.logDev('Step ' + i + '/' + steps + ' of WSS backtracking');
            const ws = this.worldStateStack.pop()
            if(!ws) {
                LOGGER.logDev('WSS ran out of steps at ' + i);
                throw new Error('WSS ran out of steps at ' + i);
            }
        }
        if (this.worldStateStack.length === targetLength) {
            LOGGER.logDev('WSS successfully restored to index ' + (this.worldStateStack.length -1));
        }
    }
    /**
     * Makes copy of most recent world state
     * @returns index of new working state
     */
    SaveCurrentWorkingState(): number {
        const newWS = this.worldStateStack[this.worldStateStack.length-1].GetCopyOfWorldState();
        this.worldStateStack.push(newWS);
        LOGGER.logDev('Pushed entry to WSS. Length: ' + this.worldStateStack.length);
        return this.worldStateStack.length -1;
    }
    GetCopyOfCurrentWorkingState() { } // ei varmaan tartte?
    // DomainSetup() {}
    RemoveWorkingState() { }
    GetIndexOfSafeWorldState() { }

}