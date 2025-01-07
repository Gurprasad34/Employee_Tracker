-- Since the id columns in the table are defined as serial we do not need to insert their values, they will automatically generate values incremeting by 1

INSERT INTO department(name) 
VALUES 
('Human Resources'),
('Engineering'),
('Marketing'),
('Finance'),
('Sales');

INSERT INTO ROL (title, salary, department_id)
VALUES
('HR Manager', 75000, 1),
('HR Associate', 50000, 1),
('Software Engineer', 95000, 2),
('DevOps Engineer', 90000, 2),
('Marketing Specialist', 60000, 3),
('Finance Analyst', 70000, 4),
('Sales Representative', 55000, 5);

INSERT INTO employee (first_name,last_name, role_id, manager_id)
VALUES
('Alice', 'Johnson', 1, NULL),
('Bob', 'Smith', 2, 1),
('Charlie', 'Brown', 3, NULL),
('David', 'Williams', 3, 3),
('Emma', 'Davis', 4, 3),
('Frank', 'Thomas', 5, NULL),
('Grace', 'Miller', 6, NULL),
('Hannah', 'Taylor', 7, NULL),
('Ian', 'Moore', 7, 8),
('Jack', 'Wilson', 7, 8);