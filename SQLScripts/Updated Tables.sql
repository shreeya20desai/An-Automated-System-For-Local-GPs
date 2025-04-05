Create database GP;

Use GP;

CREATE TABLE Admin (
    Admin_id INT PRIMARY KEY IDENTITY(1,1),
    Admin_Password VARCHAR(255) NOT NULL,
    Admin_Email VARCHAR(255) UNIQUE,

);

--  Patient table
CREATE TABLE Patient (
    P_id INT IDENTITY(1,1) PRIMARY KEY,
    P_FirstName VARCHAR(255) NOT NULL,
	P_LastName VARCHAR(255) NOT NULL,
    Gender VARCHAR(50) NOT NULL,
	DOB DATE NOT NULL,
    Email_Id VARCHAR(255) NOT NULL UNIQUE,
    Phone_No VARCHAR(15) NOT NULL UNIQUE,
    PatientPassword VARCHAR(255) NOT NULL,
	Registered_By_Admin INT FOREIGN KEY REFERENCES Admin(Admin_id)
);


CREATE TABLE Doctor (
    Doctor_id INT PRIMARY KEY IDENTITY(1,1),
    Doctor_FirstName VARCHAR(255),
    Doctor_LastName VARCHAR(255),
    Doctor_Email VARCHAR(255) UNIQUE,
    Doctor_Phone_No VARCHAR(15) UNIQUE,
    Doctor_Registration_Number VARCHAR(15) UNIQUE,
    Specialization VARCHAR(255),
    D_Password VARCHAR(255) NOT NULL,
	Registered_By_Admin INT FOREIGN KEY REFERENCES Admin(Admin_id)
);

CREATE TABLE Nurse (
    Nurse_id INT PRIMARY KEY IDENTITY(1,1),
    Nurse_FirstName VARCHAR(255),
    Nurse_LastName VARCHAR(255),
    Nurse_Email VARCHAR(255) UNIQUE,
    Nurse_Phone_No VARCHAR(15) UNIQUE,
    Nurse_Registration_Number VARCHAR(15) UNIQUE,
    Specialization VARCHAR(255), 
    N_Password VARCHAR(255)	NOT NULL,
	Registered_By_Admin INT FOREIGN KEY REFERENCES Admin(Admin_id)
);



DELETE FROM Admin where Admin_Email= 'Uol.admin@healme.com'
Select * from Admin

USE GP;