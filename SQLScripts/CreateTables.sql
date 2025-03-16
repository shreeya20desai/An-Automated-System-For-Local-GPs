Use GP;

--  Patient table
CREATE TABLE Patient (
    P_id INT PRIMARY KEY,
    DOB DATE,
    Name VARCHAR(255),
    Gender VARCHAR(50),
    Email_Id VARCHAR(255),
    Phone_No VARCHAR(15)
);

--  Doctor table
CREATE TABLE Doctor (
    D_id INT PRIMARY KEY,
    Name VARCHAR(255),
    Email_Id VARCHAR(255),
    Phone_No VARCHAR(15),
    Specialization VARCHAR(255),
    Availability DATETIME
);

--  Nurse table
CREATE TABLE Nurse (
    N_id INT PRIMARY KEY,
    Name VARCHAR(255),
    Email_Id VARCHAR(255),
    Phone_No VARCHAR(15),
    Specialization VARCHAR(255),
    ServiceType VARCHAR(100),
    Availability DATETIME
);

--  Pharmacy table
CREATE TABLE Pharmacy (
    Ph_id INT PRIMARY KEY,
    Name VARCHAR(255),
    Email_Id VARCHAR(255),
    Address VARCHAR(255)
);

--  Prescription table
CREATE TABLE Prescription (
    Presc_id INT PRIMARY KEY,
    Date DATE,
    P_name VARCHAR(255),
    D_name VARCHAR(255)
);

--  Medicine table
CREATE TABLE Medicine (
    M_id INT PRIMARY KEY,
    Name VARCHAR(255),
    Price FLOAT
);

--  Medical_records table
CREATE TABLE Medical_records (
    MR_id INT PRIMARY KEY
);

--  Appointment table
CREATE TABLE Appointment (
    App_id INT PRIMARY KEY,
    D_id INT,
    N_id INT,
    P_id INT,
    FOREIGN KEY (D_id) REFERENCES Doctor(D_id),
    FOREIGN KEY (N_id) REFERENCES Nurse(N_id),
    FOREIGN KEY (P_id) REFERENCES Patient(P_id)
);

--  Admin table
CREATE TABLE Admin (
    Name VARCHAR(255),
    Email_Id VARCHAR(255),
    Phone_No VARCHAR(15)
);
