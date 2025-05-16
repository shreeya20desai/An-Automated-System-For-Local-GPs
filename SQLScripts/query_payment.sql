CREATE TABLE payments (
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT NOT NULL,
    prescription_id VARCHAR(200) NULL, 
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount INT NOT NULL, -- amount in the smallest currency unit (e.g., pence)
    currency VARCHAR(10) NOT NULL DEFAULT 'gbp',
    payment_date DATETIME DEFAULT GETDATE(), 
    payment_status VARCHAR(50) NOT NULL,

    FOREIGN KEY (patient_id)
        REFERENCES patient(P_id)
        ON DELETE CASCADE
);
