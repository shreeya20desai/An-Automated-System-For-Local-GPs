Use GP;

	CREATE TABLE Slots (
    SlotID INT PRIMARY KEY IDENTITY(1,1),
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL
);

	INSERT INTO Slots (StartTime, EndTime) VALUES
	('09:00:00', '09:30:00'),  -- Slot 1
	('09:30:00', '10:00:00'),  -- Slot 2
	('10:00:00', '10:30:00'),  -- Slot 3
	('10:30:00', '11:00:00'),  -- Slot 4
	('11:00:00', '11:30:00'),  -- Slot 5
	('11:30:00', '12:00:00'),  -- Slot 6
	('13:00:00', '13:30:00'),  -- Slot 7
	('13:30:00', '14:00:00'),  -- Slot 8
	('14:00:00', '14:30:00'),  -- Slot 9
	('14:30:00', '15:00:00'),  -- Slot 10
	('15:00:00', '15:30:00'),  -- Slot 11
	('15:30:00', '16:00:00'),  -- Slot 12
	('16:00:00', '16:30:00'),  -- Slot 13
	('16:30:00', '17:00:00');  -- Slot 14

	CREATE TABLE DoctorAvailability (
		AvailabilityID INT PRIMARY KEY IDENTITY(1,1),
		DoctorID INT FOREIGN KEY REFERENCES Doctor(Doctor_id),
		Date DATE NOT NULL,
		SlotID INT FOREIGN KEY REFERENCES Slots(SlotID),
		CreatedAt DATETIME DEFAULT GETDATE()
	);

	CREATE TABLE NurseAvailability (
		AvailabilityID INT PRIMARY KEY IDENTITY(1,1),
		NurseID INT FOREIGN KEY REFERENCES Nurse(Nurse_id), 
		Date DATE NOT NULL,
		SlotID INT FOREIGN KEY REFERENCES Slots(SlotID),
		CreatedAt DATETIME DEFAULT GETDATE()
	);

	CREATE TABLE Appointment (
		AppointmentID INT PRIMARY KEY IDENTITY(1,1),
		DoctorID INT FOREIGN KEY REFERENCES Doctor(Doctor_id),
		PatientID INT FOREIGN KEY REFERENCES Patient(P_id), 
		Date DATE NOT NULL,
		SlotID INT FOREIGN KEY REFERENCES Slots(SlotID),
		CreatedAt DATETIME DEFAULT GETDATE(),
	);

	ALTER TABLE Appointment
ADD CONSTRAINT UC_DoctorDateSlot UNIQUE (DoctorID, Date, SlotID);

ALTER TABLE Appointment
ADD DiseaseType VARCHAR(20);

ALTER TABLE Appointment
ADD DiseaseDescription VARCHAR(100);

Select * FROM Appointment