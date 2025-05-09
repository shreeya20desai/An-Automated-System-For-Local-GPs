from flask import Flask, jsonify
import pyodbc
import os
from dotenv import load_dotenv

# https://stackoverflow.com/questions/61926327/how-does-app-flask-name-works-exactly-in-a-flask-application
# https://flask.palletsprojects.com/en/stable/tutorial/factory/



# Load environment variables from .env file
load_dotenv()

def get_db_connection():
    """Establishes a connection to SQL Server using pyodbc."""
    try:
        server = os.getenv("SQL_SERVER")
        database = os.getenv("SQL_DATABASE")
        username = os.getenv("SQL_USERNAME")
        password = os.getenv("SQL_PASSWORD")
        driver = os.getenv("SQL_DRIVER", "{ODBC Driver 17 for SQL Server}") 
        

        if not all([server, database, username, password, driver]):
            print("Missing one or more SQL Server environment variables.")
            return None

        connection_string = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
        conn = pyodbc.connect(connection_string)
        print("Successfully connected to database")
        return conn

    except pyodbc.Error as ex:
        sqlstate = ex.args[0]
        print(f"SQL Server connection error: {sqlstate}")
        print(f"Full error details: {ex}")
        raise  






get_db_connection()