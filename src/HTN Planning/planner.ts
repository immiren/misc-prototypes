import { CompoundTask, Method, PrimitiveTask } from "./tasks";
import { WorldState } from "./worldState";

// lisää world state updates
export class Planner {
    private worldStateStack: WorldState[] = [];
    private activeWorldState: WorldState;
    private rootTask: CompoundTask; // tän ei ehk pitäis olla tääl. onks planner npc-spesifi vai ei?
    constructor(rootTask: CompoundTask) {
        this.rootTask = rootTask;
        this.activeWorldState = new WorldState();
    }
    Plan(worldState: WorldState): PrimitiveTask[] {
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
    /**
     * Turns a compound task into a list of primitive tasks
     * @param task to be decomposed
     * @returns list of tasks or an empty list if no valid plan was found
     */
    DecomposeCompoundTask(task: CompoundTask): PrimitiveTask[] { 
        console.log('decomposeCompoundTask');
        // miten world state updates täs
        const methods = task.GetMethods();
        const decomposedTasks: PrimitiveTask[] = []; // basetask vai primitive
        if(methods.length <= 0) {
            throw new Error('No methods found in task ' + task);
        }

        // ettii yhen sopivan -> eteenpäi kunnes returns plan
        for(const method of methods) {
            console.log('assessing method');
            const tasks = this.DecomposeMethodTasks(method);
            if (tasks.length > 0) {
                decomposedTasks.push(...tasks);
                break;
            }
        }
        return decomposedTasks;
    }
    
    // toimii jos kaikki toimii -> jokasen compound task täytyy return jotai
    DecomposeMethodTasks(method: Method): PrimitiveTask[] 
     // primitive vs base task?
        {
            console.log('decomposeMethodTasks');
            const tasks = method.tasks;
            const decomposedTasks: PrimitiveTask[] = [];
            tasks.forEach((task) =>{
                if (task instanceof CompoundTask){
                    console.log('compound task');
                    const newTasks = this.DecomposeCompoundTask(task);
                    if (newTasks.length > 0) {
                        decomposedTasks.push(...newTasks);
                    } else {
                        // onko oikein?
                        console.warn('no plan made');
                        return [];
                    }
                } else if (task instanceof PrimitiveTask){
                    console.log('primitive task');
                    decomposedTasks.push(task);
                }
            })
         return decomposedTasks;
        }
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