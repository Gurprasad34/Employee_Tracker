
import inquirer from "inquirer";
import { pool, connectToDb } from "./db/connection";

const mainMenu = () => {
    console.log('Employee Management System');
    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
        ],
    },
    ]).then((answers) => {
    const action = answers.action;

    switch (action) {
        case 'View all departments':
        viewDepartments();
        break;
        case 'View all roles':
        viewRoles();
        break;
        case 'View all employees':
        viewEmployees();
        break;
        case 'Add a department':
        addDepartment();
        break;
        case 'Add a role':
        addRole();
        break;
        case 'Add an employee':
        addEmployee();
        break;
        case 'Update an employee role':
        updateEmployeeRole();
        break;
        case 'Exit':
        console.log('Goodbye!');
        process.exit();
        break;
        default:
        console.log('Invalid option. Please try again.');
        mainMenu();
        break;
}
    });
};
const viewDepartments = async () => {
    const res = await pool.query('SELECT * FROM department');
    console.table(res.rows);
    mainMenu();
};

const viewRoles = async () => {
    const res = await pool.query('SELECT ROL.id, ROL.title, ROL.salary, department.name AS department FROM ROL JOIN department ON ROL.department_id = department.id');
    console.table(res.rows);
    mainMenu();
};

// Function to display employees
const viewEmployees = async () => {
    const res = await pool.query(
    `SELECT employee.id, employee.first_name, employee.last_name, ROL.title AS role, department.name AS department, ROL.salary, 
        manager.first_name AS manager_first_name, manager.last_name AS manager_last_name 
    FROM employee 
    LEFT JOIN ROL ON employee.role_id = ROL.id 
    LEFT JOIN department ON ROL.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`
    );
    console.table(res.rows);
    mainMenu();
};

  // Function to add a department
const addDepartment = async () => {
    const { departmentName } = await inquirer.prompt([
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter department name:'
    }
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
    console.log(`Department ${departmentName} added successfully.`);
    mainMenu();
};

  // Function to add a role
const addRole = async () => {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id
    }));

    const { title, salary, departmentId } = await inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: 'Enter role title:'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter role salary:'
    },
    {
        type: 'list',
        name: 'departmentId',
        message: 'Choose department for this role:',
        choices: departmentChoices
    }
    ]);

    await pool.query(
    'INSERT INTO ROL (title, salary, department_id) VALUES ($1, $2, $3)',
    [title, salary, departmentId]
    );
    console.log(`Role ${title} added successfully.`);
    mainMenu();
};

  // Function to add an employee
const addEmployee = async () => {
    const roles = await pool.query('SELECT * FROM ROL');
    const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
    }));

    const managers = await pool.query('SELECT * FROM employee');
    const managerChoices = managers.rows.map(manager => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id
    }));
    managerChoices.push({ name: 'None', value: null });

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: 'Enter employee first name:'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Enter employee last name:'
    },
    {
        type: 'list',
        name: 'roleId',
        message: 'Choose employee role:',
        choices: roleChoices
    },
    {
        type: 'list',
        name: 'managerId',
        message: 'Choose employee manager:',
        choices: managerChoices
    }
    ]);

    await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [firstName, lastName, roleId, managerId]
    );
    console.log(`${firstName} ${lastName} added successfully.`);
    mainMenu();
};

  // Function to update an employee's role
const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
    }));

    const roles = await pool.query('SELECT * FROM ROL');
    const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
    }));

    const { employeeId, newRoleId } = await inquirer.prompt([
    {
        type: 'list',
        name: 'employeeId',
        message: 'Choose employee to update:',
        choices: employeeChoices
    },
    {
        type: 'list',
        name: 'newRoleId',
        message: 'Choose new role for this employee:',
        choices: roleChoices
    }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
    console.log(`Employee role updated successfully.`);
    mainMenu();
};

const startApp = async () => {
    await connectToDb();
    mainMenu();
};

startApp();


