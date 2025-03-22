Create database GP;

Use GP;
-- Patient table
CREATE TABLE Patient (
    P_id INT IDENTITY(1,1) PRIMARY KEY,
    P_Name VARCHAR(255) NOT NULL,
    Gender VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
    Email_Id VARCHAR(255) NOT NULL UNIQUE,
    Phone_No VARCHAR(15) NOT NULL UNIQUE,
    PatientPassword VARCHAR(255) NOT NULL
);