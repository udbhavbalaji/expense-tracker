import inquirer from "inquirer";
import fs from 'fs';
import os from 'os';
import path from "path";
import { checkPermissionError, deleteDirs, storeSudoUserInfo, createDirs } from "../utils/configUtils.js";


// Defining config filepaths
export const homeDir = os.homedir();
const configFolder = path.join(homeDir, '.config');
export const configDir = path.join(configFolder,'expense-tracker')
export const configFilePath = path.join(configDir,'config.json');


// Defining functions that are used to initialize/configure the app
export function readConfig() {
    if (fs.existsSync(configFilePath)) {
        const rawData = fs.readFileSync(configFilePath);
        return JSON.parse(rawData);
    }
    return {};
}


function writeConfig(config) {
    if (!fs.existsSync(configDir)) {
        try {
            fs.mkdirSync(configDir, { recursive: true });
        } catch (err) {
            checkPermissionError(err);
        }
    }
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    } catch (err) {
        checkPermissionError(err);
    }
}


export function updateConfig(config) {
    if (!fs.existsSync(configDir)) {
        console.error("App hasn't been initialized. Run 'sudo tracker init' to initialize the app.");
        process.exit(1);
    }
    let oldConfig = readConfig();

    deleteDirs([
        oldConfig.transactionDir,
        oldConfig.targetDir,
        oldConfig.resourcesDir
    ]);

    writeConfig(config);

    createDirs([
        config.transactionDir,
        config.targetDir,
        config.resourcesDir
    ], config.userInfo.uid, config.userInfo.gid);
}


export async function configureApp(defaultChoiceFlag) {
    let chosenConfig = null;
    let defaultConfig = {
        transactionDir: path.join(homeDir, ".expense-tracker/transactions"),
        targetDir: path.join(homeDir, "Downloads"),
        resourcesDir: path.join(homeDir, ".expense-tracker/resources"),
        dateFormat: "YYYY-MM-DD",
        userInfo: {}
    };

    if (!defaultChoiceFlag) {
        let answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'transactionDir',
                message: 'Enter the path of the location you want to store your transactions: ',
                default: defaultConfig.transactionDir
            },
            {
                type: 'input',
                name: 'targetDir',
                message: 'Enter the path of the location you want your reports generated: ',
                default: defaultConfig.targetDir
            },
            {
                type: 'input',
                name: 'resourcesDir',
                message: 'Enter the path of the location you want to store app resources: ',
                default: defaultConfig.resourcesDir
            },
            {
                type: 'list',
                name: 'dateFormat',
                message: 'Choose your preferred date format while logging transactions',
                choices: [
                    'YYYY-MM-DD',
                    'DD-MM-YYYY',
                    'MM-DD-YYYY',
                    'YYYY-DD-MM'
                ],
                default: defaultConfig.dateFormat
            },
        ]);
        answers.userInfo = storeSudoUserInfo();
        writeConfig(answers);
        chosenConfig = answers;
    } else {
        defaultConfig.userInfo = storeSudoUserInfo();
        writeConfig(defaultConfig);
        chosenConfig = defaultConfig;
    }

    createDirs([
        chosenConfig.transactionDir,
        chosenConfig.targetDir,
        chosenConfig.resourcesDir
    ], chosenConfig.userInfo.uid, chosenConfig.userInfo.gid);

    console.log('Configuration complete!');
}


export const currentConfig = readConfig();
