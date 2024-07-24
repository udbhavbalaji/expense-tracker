#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "../src/commands/init.js";
import { addCommand } from "../src/commands/add.js";
import { readConfig } from "../src/config/config.js";
import { configCommand } from "../src/commands/config.js";

const currentConfig = readConfig();

// Entry point to the app
const program = new Command('tracker')
    .description('This tool helps track transactions, with the ability to generate summarized reports, all from the command line.')
    .version('0.0.1');

// Adding required/eligible commands to the app based on app initialization
if (Object.keys(currentConfig).length === 0) {
    program.addCommand(initCommand);
} else {
    program.addCommand(addCommand);
    program.addCommand(configCommand);
}

program.parse(process.argv);
