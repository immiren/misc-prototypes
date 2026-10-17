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
  setInterval(() => {
    const newPlan = creature.planner.Plan(creature.worldState);
    if (plan.length > 0) creature.plan = newPlan;
    creature.planRunner.ExecutePlan(newPlan);
  }, 10000);
  // update world state
  // request plan
  // run plan
}

function domain(): CompoundTask{
  const log = document.getElementById("3");
  let logCount = 0;
  if (!log) throw new Error('no log found :(');
  const logTask = (message: string) => {
    logCount++;
    console.log(logCount + ' ' + message);
    log.innerHTML += logCount + ": " + message + "<br>";
  }

  // task 1
  const ptask1 = new PrimitiveTask([{
    name: eCondition.bTestValue,
    value: true
  },{name: eCondition.bSeesTarget, value: false}], [{name:eCondition.bTestValue, value: false}],
  ()=>{
  logTask('Creature switches test value from true to false');
  return TaskResult.SUCCESS;
  });

  // task 2
  const ptask2 = new PrimitiveTask([],[{name: eCondition.bSeesTarget, value: false}], () =>{
    setTimeout(()=> {
    logTask('Set seestarget to true'); 
    }, 100);
    return TaskResult.SUCCESS;
  })

  
  const task1 = new CompoundTask([{tasks:[ptask1, ptask2], preconditions: []}]);
  return task1;
}

main();