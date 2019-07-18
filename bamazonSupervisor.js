// REQUIRES
const inquirer = require('inquirer');
const helper = require('./helperFunctions');



// FUNCTIONS
function askSupervisorDuties() {
    console.log('');

    inquirer
        .prompt([
            {
                name: 'managerDuty',
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
            }
        ])
        .then((response) => {
            const choice = response.managerDuty;

            switch (choice) {
                case 'View Product Sales by Department':
                    viewDepartmentSales();
                    break;
                case 'Create New Department':
                    createDepartment();
                    break;
            }
        }).catch((err) => {
            console.log(err);
            return;
        });
}

async function viewDepartmentSales() {
    const profitTable = await helper.getProfitTable();
    const formattedTable = helper.formatProfitTable(profitTable);

    console.log('');
    console.table(formattedTable);
    askSupervisorDuties();
}

function createDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartmentName',
                type: 'input',
                message: 'What\'s the name of the department?'
            },
            {
                name: 'newDepartmentOverhead',
                type: 'number',
                message: 'How much is the estmated overhead cost of the department?'
            }
        ])
        .then((response) => {
            let newDepartment = {
                department_name: response.newDepartmentName,
                over_head_costs: response.newDepartmentOverhead
            };
        
            helper.addToTable('departments', newDepartment);
            askSupervisorDuties();
        }).catch((err) => {
            console.log(err);
            return;
        });
}



// FUNCTION CALLS
askSupervisorDuties();