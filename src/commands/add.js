import path from 'path';
import { createObjectCsvWriter } from "csv-writer";
import { Command } from 'commander';
import { currentConfig } from '../config/config.js';
import { getTodaysDate, validateDate, validateFloat, confirmAction } from '../utils/commandUtils.js';


// Defining the 'add' command
const addCommand = new Command('add')
    .description('Adds a transaction. <Need to add better description after implementing category.>');


// Defining functions that perform the operations outlined in the add command
function addExpense(record, filepath) {
    const csvWriter = createObjectCsvWriter({
        path: path.join(filepath, 'expenses.csv'),
        header: [
            {id: 'merchant', title: 'Merchant'},
            {id: 'amount', title: 'Amount'},
            {id: 'date', title: 'Date'},
            {id: 'description', title: 'Description'},
            {id: 'required', title: 'Required'}
        ],
        append: true
    });

    csvWriter.writeRecords([record])
        .then(() => {
            console.log('Expense Added!');
        })
        .catch((err) => console.error(err.message));
}


function addIncome(record, filepath) {
    const csvWriter = createObjectCsvWriter({
        path: path.join(filepath, 'incomes.csv'),
        header: [
            {id: 'source', title: 'Source'},
            {id: 'amount', title: 'Amount'},
            {id: 'date', title: 'Date'},
            {id: 'description', title: 'Description'},
            {id: 'nonTaxable', title: 'NonTaxable'}
        ],
        append: true
    });

    csvWriter.writeRecords([record])
        .then(() => {
            console.log('Income Added!');
        })
        .catch((err) => console.error(err.message));
}


// Defining sub-commands under the 'add' command to add an income/expense
addCommand.command('expense')
    .description('Adds an Expense.')
    .argument('<merchant>', 'Name of the merchant where money was spent.')
    .argument('<amount>', 'Amount spent on this transaction (in CAD$).', (value) => validateFloat(value))
    .option('--desc <desc>', 'Short description of transaction.', 'Not Specified')
    .option('-d, --date <date>', `Date of the transaction. (${currentConfig.dateFormat})`, (value) => validateDate(value, currentConfig.dateFormat), getTodaysDate(currentConfig.dateFormat))
    .option('-r, --required', 'Marks the expense as required.', false)
    .action(async (merchant, amount, options) => {
        console.log(options);
        const record = {
            merchant: merchant,
            amount: amount,
            date: options.date,
            description: options.desc,
            required: options.required
        };
        console.log(record);
        const confirmed = await confirmAction('The above expense will be recorded. Confirm?');
        if (confirmed) {
            addExpense(record, currentConfig.transactionDir);
        } else {
            console.log('Transaction Aborted.');
        }
    });


addCommand.command('income')
    .description('Adds an Income.')
    .argument('<source>', 'Name of the source where the money was received/earned.')
    .argument('<amount>', 'Amount earned in this transaction (in CAD$).', (value) => validateFloat(value))
    .option('--desc <desc>', 'Short description of transaction.', 'Not Specified')
    .option('-d, --date <date>', `Date of the transaction. (${currentConfig.dateFormat})`, (value) => validateDate(value, currentConfig.dateFormat), getTodaysDate(currentConfig.dateFormat))
    .option('-nt, --notax', 'Marks the expense as non-taxable.', false)
    .action(async (source, amount, options) => {
        const record = {
            source: source,
            amount: amount,
            date: options.date,
            description: options.desc,
            nonTaxable: options.notax
        };
        console.log(record);
        const confirmed = await confirmAction('The above income will be recorded. Confirm?');
        if (confirmed) {
            addIncome(record, currentConfig.transactionDir);
        } else {
            console.log('Transaction Aborted.');
        }
    })


export { addCommand };
