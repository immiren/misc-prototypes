import { Creature } from "./creature";
import { domain } from "./HTN Planning/domain";
import { WorldState } from "./HTN Planning/worldState";
import { Logger } from "./logger";

export const LOGGER = new Logger();


function main() {

  const header = document.getElementById("header");

  if (header) {
    console.log('header found');
    header.textContent = "Test successful";
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
  creature.planRunner.ExecutePlan(plan, creature.worldState);
  setInterval(() => {
    const newPlan = creature.planner.Plan(creature.worldState);
    if (plan.length > 0) creature.plan = newPlan;
    creature.planRunner.ExecutePlan(newPlan, creature.worldState);
    creature.worldState.GetCopyOfWorldState();

  }, 10000);
  // update world state
  // request plan
  // run plan
}

main();