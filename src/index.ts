import { Creature } from "./creature";
import { domain } from "./HTN Planning/domain";

export { LOGGER } from "./logger";

const HTN_TICK_DELAY = 10000;

function main() {
  // setup
  const creature = new Creature(domain());

  // Game loop
  setInterval(() => {
    creature.Tick();
  }, HTN_TICK_DELAY);
}

main();