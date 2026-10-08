import { Creature } from "./creature";
import { CompoundTask, PrimitiveTask, TaskResult } from "./HTN Planning/tasks";
import { eCondition, WorldState } from "./HTN Planning/worldState";

function main() {

  const header = document.getElementById("header");

  if (header) {
    console.log('header found');
    header.textContent = "test successful";
  }
  setup();
  console.log("TypeScript loaded");
}

function setup() {
  // setup
  // mitä tapahtuu kun hahmo luodaan?
  // tarttee ws ja domain
  
  const creature = new Creature(domain());
  const plan = creature.planner.Plan(creature.worldState);
  console.log('plan length ' + plan.length);
  if (plan.length > 0) creature.plan = plan;
  creature.planRunner.ExecutePlan(plan);
  console.log('setup');
  console.warn('setup');
  // update world state
  // request plan
  // run plan
}

function domain(): CompoundTask{

  const ptask1 = new PrimitiveTask([{
    name: eCondition.bTestValue,
    value: true
  },{name: eCondition.bSeesTarget, value: false}], [{name:eCondition.bTestValue, value: false}],
  ()=>{
  console.log('Creature switches test value from true to false');
  const one = document.getElementById("1");
  if (one) one.textContent += 'Creature switches test value from true to false';
  return TaskResult.SUCCESS;
  });
  const ptask2 = new PrimitiveTask([],[{name: eCondition.bSeesTarget, value: false}], () =>{
    console.log('Set seestarget to true'); 
    const two = document.getElementById("2");
  if (two) two.textContent += 'Set seestarget to true';
  
    return TaskResult.SUCCESS;
  })
  const task1 = new CompoundTask([{tasks:[ptask1, ptask2], preconditions: []}]);
  return task1;
}

main();