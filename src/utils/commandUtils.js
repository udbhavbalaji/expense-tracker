import inquirer from "inquirer";
import moment from "moment";


// Defining utility functions that are used in the definition of app commands
export async function confirmAction(message) {
    const response = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: message,
            default: true
        }
    ]);
    return response.confirm;
}

export function getTodaysDate(dateFormat) {
    return moment().format(dateFormat);
}

export function dateOneYearAgo(dateFormat) {
    return moment().subtract(1, 'year').format(dateFormat);
}

export function validateDate(dateInput, dateFormat) {
    const date = moment(dateInput, dateFormat, true);
    if (!date.isValid()){
        throw new Error(`Invalid date format. Please use ${dateFormat}.`)
    }
    return date.format(dateFormat);
}

export function validateFloat(value) {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
        console.error('Invalid amount entered.');
        process.exit(1);
    }
    return parsed;
}