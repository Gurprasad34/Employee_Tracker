-- THINGS TO KNOW
-- Primary Key is a unique identifier for rows in its own table
-- Foreign Key typically references a primary key in another table

DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

\c business_db;


-- DEPARTMENT TABLE
-- UNIQUE ensures there are no duplicates
CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);


-- ROLE TABLE
-- department ID is a foreign key since we are referencing from the department table
CREATE TABLE ROL (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL REFERENCES department(id)
);

-- EMPLOYEE TABLE
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  manager_id INTEGER REFERENCES employee(id),
  role_id INTEGER REFERENCES ROL(id)
);




