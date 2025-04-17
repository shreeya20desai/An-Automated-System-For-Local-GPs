Use Gp

-- NOTE: The pharmacy details are taken from the Google maps.
CREATE TABLE pharmacy (
    pharmacy_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    street VARCHAR(150),
    city VARCHAR(100),
    postcode VARCHAR(20),
    contact_number VARCHAR(20),
    opening_time TIME,
    closing_time TIME
);

INSERT INTO pharmacy (pharmacy_id, name, street, city, postcode, contact_number, opening_time, closing_time) VALUES
(1, 'Boots - Highcross', '38-39 Shires Walk', 'Leicester', 'LE1 4FQ', '0116 262 4149', '08:30:00', '20:00:00'),
(2, 'Boots - Gallowtree Gate', '30-36 Gallowtree Gate', 'Leicester', 'LE1 1DD', '0116 242 3200', '07:00:00', '20:00:00'),
(3, 'Boots - Thurmaston', 'Barkby Thorpe Lane', 'Leicester', 'LE4 8GP', '0116 269 4948', '08:00:00', '20:00:00'),
(4, 'Boots - Braunstone Lane', '532 Braunstone Lane', 'Leicester', 'LE3 3DH', '0116 289 8650', '09:00:00', '18:00:00'),
(5, 'Boots - Fosse Park', 'Fosse Park Avenue', 'Leicester', 'LE19 1HX', '0116 289 2382', '09:00:00', '20:00:00'),
(6, 'Lloyds Pharmacy - Uppingham Road', '236 Uppingham Rd', 'Leicester', 'LE5 0QG', '0116 276 7188', '09:00:00', '18:00:00'),
(7, 'Well Pharmacy - Melton Road', '17 Melton Rd', 'Leicester', 'LE4 6PN', '0116 266 1142', '09:00:00', '17:30:00'),
(8, 'Rowlands Pharmacy - Aylestone', '618 Aylestone Rd', 'Leicester', 'LE2 8TD', '0116 283 3170', '09:00:00', '18:00:00'),
(9, 'Tesco Pharmacy - Hamilton', '5 Maidenwell Avenue, Hamilton', 'Leicester', 'LE5 1BJ', '0345 677 9310', '09:00:00', '18:30:00');



CREATE TABLE medicine (
    medicine_id INT PRIMARY KEY IDENTITY(1,1),
    medicine_name VARCHAR(100) NOT NULL,
    disease_id INT,
    dosage VARCHAR(100),
    form VARCHAR(50),
    manufacturer VARCHAR(100),
    side_effects VARCHAR(255),
    FOREIGN KEY (disease_id) REFERENCES disease([Disease_id])

);

select * from Disease

-- NOTE: The medicine details are taken from the internet.
INSERT INTO medicine (medicine_name, disease_id, dosage, form, manufacturer, side_effects) VALUES
('Paracetamol', 2, '500mg every 6 hours', 'Tablet', 'Crocin', 'Nausea, rash'),
('Cetrizine', 6, '10mg once a day', 'Tablet', 'Dr. Reddys', 'Drowsiness'),
('Salbutamol', 7, '2 puffs every 4-6 hrs', 'Inhaler', 'GlaxoSmithKline', 'Tremor, headache'),
('Metformin', 8, '500mg twice daily', 'Tablet', 'Sun Pharma', 'Stomach upset'),
('Losartan', 9, '50mg once daily', 'Tablet', 'Zydus', 'Dizziness, fatigue'),
('Omeprazole', 10, '20mg once daily', 'Capsule', 'Cipla', 'Headache, abdominal pain'),
('Calpol', 3, '5ml every 6 hrs', 'Syrup', 'GSK', 'Rash'),
('Amoxicillin', 28, '500mg three times daily', 'Capsule', 'Pfizer', 'Diarrhea, allergic reaction'),
('Adapalene', 12, 'Apply once daily', 'Cream', 'Galderma', 'Dryness, redness'),
('Methotrexate', 13, 'Once weekly as directed', 'Tablet', 'Various', 'Nausea, fatigue'),
('Levothyroxine', 14, 'Once daily in the morning', 'Tablet', 'Various', 'Palpitations, weight loss'),
('Glucagon', 15, 'As needed for severe hypoglycemia', 'Injection', 'Eli Lilly', 'Nausea, vomiting'),
('Aspirin', 16, '75mg once daily', 'Tablet', 'Bayer', 'Stomach upset, bleeding'),
('Amiodarone', 17, 'Dosage varies', 'Tablet', 'Various', 'Thyroid problems, liver issues'),
('Phenytoin', 19, 'Dosage varies', 'Capsule', 'Various', 'Drowsiness, gum overgrowth'),
('Lactulose', 20, 'As needed', 'Syrup', 'Various', 'Gas, bloating'),
('Mesalamine', 21, 'Dosage varies', 'Tablet', 'Various', 'Abdominal pain, diarrhea'),
('Tamoxifen', 22, 'Once daily', 'Tablet', 'Various', 'Hot flashes, mood changes'),
('Imatinib', 23, 'Once daily', 'Tablet', 'Novartis', 'Nausea, fatigue'),
('Timolol', 25, 'Eye drops twice daily', 'Solution', 'Various', 'Blurred vision, eye irritation'),
('Ibuprofen', 26, '200-400mg every 4-6 hours as needed', 'Tablet', 'Various', 'Stomach upset'),
('Prednisolone', 27, 'Dosage varies', 'Tablet', 'Various', 'Weight gain, mood changes'),
('Azithromycin', 29, 'Once daily for a few days', 'Tablet', 'Various', 'Nausea, diarrhea'),
('Ciprofloxacin', 30, 'Twice daily', 'Tablet', 'Various', 'Nausea, dizziness')



-- Added dummy prices of Medicine
ALTER TABLE [GP].[dbo].[medicine]
ADD price DECIMAL(10,2);

UPDATE [GP].[dbo].[medicine]
SET price = CASE medicine_id
    WHEN 1 THEN 20.00
    WHEN 2 THEN 15.00
    WHEN 3 THEN 180.00
    WHEN 4 THEN 25.00
    WHEN 5 THEN 30.00
    WHEN 6 THEN 28.00
    WHEN 7 THEN 22.00
    WHEN 8 THEN 40.00
    WHEN 9 THEN 120.00
    WHEN 10 THEN 300.00
    WHEN 11 THEN 50.00
    WHEN 12 THEN 350.00
    WHEN 13 THEN 18.00
    WHEN 14 THEN 270.00
    WHEN 15 THEN 85.00
    WHEN 16 THEN 40.00
    WHEN 17 THEN 90.00
    WHEN 18 THEN 250.00
    WHEN 19 THEN 1200.00
    WHEN 20 THEN 60.00
    WHEN 21 THEN 10.00
    WHEN 22 THEN 45.00
    WHEN 23 THEN 75.00
    WHEN 24 THEN 60.00
    WHEN 25 THEN 110.00
    ELSE NULL
END
	

-- Student_Price (10% discount)
ALTER TABLE [GP].[dbo].[medicine]
ADD student_price AS CAST(price * 0.90 AS DECIMAL(10,2));


select * from medicine