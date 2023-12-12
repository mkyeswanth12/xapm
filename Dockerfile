FROM node:latest

RUN apt-get update && apt-get install -y postgresql postgresql-contrib ansible

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install -g react-scripts@latest
RUN npm install express pg bcryptjs
RUN npm install

COPY . .

ENV DB_NAME="docketeer-db"
ENV DB_USER="postgres"
ENV DB_PASS="postgres"
ENV DB_SERVICE_NAME="db"
ENV JWT_SECRET="your_jwt_secret_here"
ENV REACT_DASHBOARD_PORT=2999
ENV REACT_REACT_DASHBOARD_ORG_ID=1


RUN echo "local all postgres trust" > /etc/postgresql/15/main/pg_hba.conf \
    && chown postgres:postgres /etc/postgresql/15/main/pg_hba.conf \
    && chmod 600 /etc/postgresql/15/main/pg_hba.conf


COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh
RUN service postgresql start
COPY postgresql_setup.yaml /usr/src/app/postgresql_setup.yaml
RUN ansible-playbook /usr/src/app/postgresql_setup.yaml

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
