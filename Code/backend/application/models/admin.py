import pyodbc
import hashlib
from application.utils.db_helpers import get_db_connection
import os



# This function creates admin Id and password
def insert_admin():
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()

            # This two lines are used to set default admin email and password
            # SHA256 secure hash algorithm
            admin_password = hashlib.sha256('shree'.encode()).hexdigest()  
            admin_email = 'Uol.admin@thehealme.com'

            # Check if the  admin already exists
            cursor.execute("SELECT 1 FROM Admin WHERE Admin_Email = ?", (admin_email,))
            existing_admin = cursor.fetchone()

            if not existing_admin:
                # Insert the admin details into the database
                cursor.execute("""
                    INSERT INTO Admin (Admin_Password, Admin_Email)
                    VALUES (?, ?)
                """, ( admin_password, admin_email))
                conn.commit()
                print("Admin Created successfully.")
            else:
                print("Admin user already exists.")

        except pyodbc.Error as ex:
            sqlstate = ex.args[0]
            print(f"Database error: {sqlstate}")
            print(ex)

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            conn.close()
    else:
        print("Database connection failed. Dummy admin insert aborted.")


insert_admin()