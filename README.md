<p align="center">
  <a href="https://xerocodee.com/" target="_blank">
    <img width="150" height="150" src="https://xerocodee-frontend-assets.s3.ap-south-1.amazonaws.com/frontend-web/images/logo.svg" alt="XeroCodee Logo">
  </a>
</p>

XAPM is an intuitive and developer-friendly application that seamlessly combines container management and metric visualization into a unified interface.

<p align="center">
  XAPM is a streamlined interface for overseeing Docker resources. Designed with user-friendliness in mind, it effortlessly showcases metrics from both host and container environments. Moreover, it seamlessly integrates with Kubernetes, providing valuable insights into cluster data. What sets XAPM apart is its containerized nature, ensuring hassle-free deployment right next to your app cluster. This design minimizes friction, making container management and performance tracking simpler than ever. Experience the next level of container orchestration with XAPM.
</p>

## Application and Architecture

### Application Type: Monolithic
XAPM follows a monolithic architecture. This means that all components of the application, including the user interface, logic, and database access, are tightly integrated into a single deployable unit. While this approach might limit scalability compared to microservices, it simplifies development and deployment.

### Deployment Automation: Ansible
Ansible is used to automate the deployment process of XAPM. It handles the setup and configuration tasks, ensuring a smooth deployment across different environments. With Ansible, deploying the application, configuring PostgreSQL, orchestrating Kubernetes, and managing necessary configurations is made easier and more consistent.

This setup prioritizes simplicity in deployment while maintaining the ease of management for XAPM.


## Changes Made

1. While testing Node.js at the `npm install` command, I observed that `package.json` was outdated. I added the following dependencies:
    - `"react-scripts": "^5.0.1"`
    - `"typescript": "^4.9.5"`
    
   Additionally, I executed the following commands:
   ```sh
   RUN npm install -g npm@latest
   RUN npm install -g react-scripts@latest
   RUN npm install express pg bcryptjs
   RUN npm install

## Instructions to Run

To run this application:

1. Clone this repository:
   ```sh
   git clone https://github.com/mkyeswanth12/xapm.git
   cd xapm

   docker build -t xapm-img .
2. Kubernetes deployment:
   ```sh
   ansible-playbook kubernetes_playbook.yml
 ## Challenges Faced and Seeking Support

### Hurdles Encountered

While attempting to run the server for XAPM, I encountered an unexpected hurdle - the inability to sign up. This issue left me feeling stranded and hindered my progress. Being a beginner in JavaScript, troubleshooting.

![Screenshot_2023-12-12_22-45-20](https://github.com/mkyeswanth12/xapm/assets/47426782/9b9666c9-6933-463e-8440-5aede437ee63)

## Successfully, I have managed to run the project

![Screenshot_2023-12-12_22-48-30](https://github.com/mkyeswanth12/xapm/assets/47426782/300c9438-9530-44ed-bcd2-0f8c24d6b0c1)


![Screenshot_2023-12-12_22-45-07](https://github.com/mkyeswanth12/xapm/assets/47426782/af0ab49b-afc4-47ac-9e69-b865ed49ac61)



