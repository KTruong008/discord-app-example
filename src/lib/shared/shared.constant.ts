// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1
};
export const TEST_COMMAND_2 = {
  name: 'test2',
  description: 'Basic guild command2',
  type: 1
};

// // Command containing options
// export const CHALLENGE_COMMAND = {
//   name: 'challenge',
//   description: 'Challenge to a match of rock paper scissors',
//   options: [
//     {
//       type: 3,
//       name: 'object',
//       description: 'Pick your object',
//       required: true,
//       choices: createCommandChoices()
//     }
//   ],
//   type: 1
// };

export const GLOBAL_COMMANDS = [TEST_COMMAND, TEST_COMMAND_2];
