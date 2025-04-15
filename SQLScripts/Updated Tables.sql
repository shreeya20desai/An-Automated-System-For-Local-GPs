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

-- updating doctor table to add specialisation table for better scalabilty
ALTER TABLE Doctor
ADD Specialization_ID INT;

ALTER TABLE Doctor
DROP COLUMN Specialization;

ALTER TABLE Doctor
ADD CONSTRAINT FK_Doctor_Specialization
FOREIGN KEY (Specialization_ID) REFERENCES Specialization(Specialization_ID);

INSERT INTO Specialization (Specialization_Name)
VALUES 
('Cardiology'),
('Neurology'),
('Orthopedics'),
('Pediatrics'),
('Dermatology'),
('Gastroenterology'),
('Oncology'),
('Endocrinology'),
('Urology'),
('Ophthalmology');

INSERT INTO Specialization (Specialization_Name)
VALUES ('General');


Select * from Specialization


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


-- Adding Specialization_ID to the Nurse table
ALTER TABLE Nurse
ADD Specialization_ID INT;

ALTER TABLE Nurse
DROP COLUMN Specialization;


-- Adding a foreign key constraint to the Nurse table to link to Nurse_Specialization
ALTER TABLE Nurse
ADD CONSTRAINT FK_Nurse_Specialization
FOREIGN KEY (Specialization_ID) REFERENCES Nurse_Specialization(Specialization_ID);




CREATE TABLE Nurse_Specialization (
    Specialization_ID INT PRIMARY KEY IDENTITY(1,1),
    Specialization_Name VARCHAR(255) NOT NULL
);

-- Insert essential nurse specializations
INSERT INTO Nurse_Specialization (Specialization_Name)
VALUES 
('Critical Care Nurse'),
('Emergency Room Nurse'),
('Cardiac Nurse'),
('Neonatal Nurse'),
('Pediatric Nurse'),
('Oncology Nurse'),
('Orthopedic Nurse'),
('Geriatric Nurse'),
('Surgical Nurse'),
('Dialysis Nurse');


select* from Nurse

CREATE TABLE Disease (
    Disease_id INT PRIMARY KEY IDENTITY(1,1),
    Disease_Name VARCHAR(255) NOT NULL,
    Specialization_id INT NOT NULL,
    FOREIGN KEY (Specialization_id) REFERENCES Specialization(Specialization_id)
);

Select * from Disease
INSERT INTO Disease (Disease_Name, Specialization_id)
VALUES 
('Fever', 11),  -- General
('Cough', 11),  -- General
('Abdominal Pain', 6),  -- Gastroenterology
('Headache', 2),  -- Neurology
('Cold', 11),  -- General
('Asthma', 11),  -- General
('Diabetes', 8),  -- Endocrinology
('Hypertension', 1),  -- Cardiology
('Gastritis', 6),  -- Gastroenterology
('Chickenpox', 5);  -- Dermatology


CREATE TABLE Specialization (
    Specialization_id INT PRIMARY KEY IDENTITY(1,1),
    Specialization_Name VARCHAR(255) UNIQUE NOT NULL
);

DELETE FROM Admin where Admin_Email= 'Uol.admin@healme.com'
Select * from Admin

USE GP;

Select * from doctor

select * from Patient

select * from DoctorAvailability

Select * from Appointment