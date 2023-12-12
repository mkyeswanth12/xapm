# Use Node.js image
FROM node:latest

# Install PostgreSQL and Ansible
RUN apt-get update && apt-get install -y postgresql postgresql-contrib ansible

# Copy package files and install dependencies
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install -g react-scripts@latest
RUN npm install express pg bcryptjs
RUN npm install

# Copy the entire project
COPY . .

# Environment variables
ENV DB_NAME="docketeer-db"
ENV DB_USER="postgres"
ENV DB_PASS="postgres"
ENV DB_SERVICE_NAME="db"
ENV JWT_SECRET="your_jwt_secret_here"
ENV REACT_DASHBOARD_PORT=2999
ENV REACT_REACT_DASHBOARD_ORG_ID=1

# Create a new pg_hba.conf file
RUN echo "local all postgres trust" > /etc/postgresql/15/main/pg_hba.conf \
    && chown postgres:postgres /etc/postgresql/15/main/pg_hba.conf \
    && chmod 600 /etc/postgresql/15/main/pg_hba.conf

# Copy the entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh

# Grant execute permissions to the script
RUN chmod +x /usr/src/app/entrypoint.sh

# Start the PostgreSQL service
RUN service postgresql start

# Delay execution of Ansible to ensure PostgreSQL service is running
COPY postgresql_setup.yaml /usr/src/app/postgresql_setup.yaml

# Execute the Ansible playbook to set up PostgreSQL
RUN ansible-playbook /usr/src/app/postgresql_setup.yaml

# Set the entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
