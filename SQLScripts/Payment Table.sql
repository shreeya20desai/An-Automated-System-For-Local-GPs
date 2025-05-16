CREATE TABLE payments (
    payment_id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT NOT NULL,
    prescription_id INT NULL, 
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount INT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'gbp',
    payment_date DATETIME DEFAULT GETDATE(), 
    payment_status VARCHAR(50) NOT NULL,

	 FOREIGN KEY (patient_id)
    REFERENCES patient(P_id)
    ON DELETE CASCADE,
);


EXEC sp_rename 'payments.stripe_payment_intent_id', 'stripe_checkout_session_id', 'COLUMN';


  select * from patient

  Delete from payments where patient_id = 19


  SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'payments';

    ALTER TABLE [GP].[dbo].[payments]
ALTER COLUMN [prescription_id] VARCHAR(200);
Use GP;