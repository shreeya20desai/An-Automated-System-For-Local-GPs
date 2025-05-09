FROM python:3.10-slim

WORKDIR /app

# Installing the dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 unixodbc-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install the dependencies of Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Production level(gunicorn) used for flask application.
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
