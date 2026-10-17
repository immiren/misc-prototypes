import { CompoundTask, PrimitiveTask, TaskResult } from "./tasks";
import { eCondition } from "./worldState";

// tänne tasks? vai missä niitten luonti
export function domain(): CompoundTask{
  // task 1
  const ptask1 = new PrimitiveTask(
    "Task 1",
    [{
    key: eCondition.bTestValue,
    value: true
  },{key: eCondition.bSeesTarget, value: false}], [{key:eCondition.bTestValue, value: false}],
  'Creature switches test value from true to false', 
  ()=>{
  return TaskResult.SUCCESS;
  });

  // task 2
  const ptask2 = new PrimitiveTask("Task 2",[],[{key: eCondition.bSeesTarget, value: false}], 
    'Set seestarget to true',
    () =>{ return TaskResult.SUCCESS;})

  
  const task1 = new CompoundTask([{tasks:[ptask1, ptask2], preconditions: []}]);
  return task1;
}