import { Command } from "commander";
import { readConfig } from "../config/config.js";

const configCommand = new Command('config')
    .description("Interact with the app's configuration settings.");


configCommand.command('show')
    .description("Shows the app's configuration.")
    .action(() => {
        let currentConfig = readConfig();
        delete currentConfig.userInfo;
        console.log(currentConfig);
    })


configCommand.command('update')
    .description("Updates the app's configuration.")
    .option('-d, --data', 'The path of the data directory.')
    .option('-t, --target', 'The path of the target directory (where reports are generated).')
    .option('-r, --resource', 'The path of the resources directory.')
    .action((options) => {
        console.log(options.data);
    });


export { configCommand };