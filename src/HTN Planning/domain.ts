import { LOGGER } from "..";
import { CompoundTask, PrimitiveTask, TaskResult } from "./tasks";
import { eCondition } from "./worldState";

// tänne tasks? vai missä niitten luonti
export function domain(): CompoundTask {

  //huom task variables on nyt toosi huonosti järjestelty ja lisätty. fiksaa

  // task 1
  let task1Counter = 0;
  const ptask1 = new PrimitiveTask(
    "Task 1 Turn 3 times",
    [{
      key: eCondition.bTestValue,
      value: true
    }/*, { key: eCondition.bSeesTarget, value: false }*/], [{ key: eCondition.bTestValue, value: false }],
    () => {
      if (task1Counter != 2) {
        LOGGER.logTask('Task round ' + task1Counter + '/3. Waiting.');
        task1Counter++;
        return TaskResult.WAITING;
      } else if (task1Counter === 2) {
        LOGGER.logTask('Task round 3/3. Creature switches test value from true to false');
        return TaskResult.SUCCESS;
      } else return TaskResult.FAILURE;
    },
    () => {

    },
  );

  // task 2
  let task2Value = 0;
  let task2Tries = 0;
  const maxValue = 10;
  const requirement = 7;
  const ptask2 = new PrimitiveTask("Task 2 Find target", [], [{ key: eCondition.bSeesTarget, value: true }],
    () => {
      task2Tries++;
      task2Value = Math.random() * maxValue;
      if (task2Value >= requirement) {
        LOGGER.logTask('Target found with ' + task2Value + ' on try n ' + task2Tries);
        return TaskResult.SUCCESS;
      }

      if (task2Tries <= 10) {
        LOGGER.logTask('Target not found with ' + task2Value + ' on try n ' + task2Tries);
        return TaskResult.WAITING;
      } else {
        LOGGER.logTask('Target not found with ' + task2Value + ' on try n ' + task2Tries + '. Failing.');
        return TaskResult.FAILURE;
      }
    },
    () => {
      LOGGER.logDev('clearing task2 tries and value');
      task2Tries = 0;
      task2Value = 0;
    })


  const task1 = new CompoundTask([{ tasks: [ptask1, ptask2], preconditions: [] }]);
  return task1;
}