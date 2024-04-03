# Taskenize (Agenda like app)
 Taskenize is a multitenant application, designed to be a daily assistant in task management, aimed at individuals, small to medium enterprises, as well as teams within large organisations. This application is envisioned to allow individuals to plan their activities more easily, while providing companies and teams with the tool for transparent task management, resource utilisation, and an enabler of collaboration within and between the teams.  
 This project is developed as a closure of 3-month long apprenticeship program. Development time - 7weeks.



 > **Note on the Frontend:** The frontend is still in an early stage of development and represents a raw version of app vision. It does not fully showcase the intended quality and user experience just yet. This area is slated for significant enhancements moving forward.

## My Contribution to App Development
- Application design (User requirements, process flows, UX low fidelity design...)
- Development of the entire backend 
- Database design
- Development of authentication functionalities (login, registration, password reset) on the frontend
- Design of the landing page using HTML/CSS, logo
- Standardization of repetitive FE tasks ("utilities" folder in FE)

## Technical Details

### Frontend:
 - Vue.js
 - HTML/CSS
 - Axios for HTTP requests
 - Pinia for state management
 - Vue Router
 - Vite as build tool


### Backend:
 - MARS Engine (MARS server) - a serverless technology for rapid development
 - JavaScript for backend logic
 - MySQL for database


### App Architecture:
TASKENIZE utilizes a client-server architecture, where the frontend is developed using Vue3 (Composition API style) for an interactive user experience, while the backend is based on the MARS engine, a serverless technology that enables efficient management of backend logic without the need for detailed DevOps configurations. Communication between the client and server occurs over defined RESTful API routes.

The backend consists of modularly organized JavaScript files that implement functionalities such as user management, authentication, and task, project and workspace management. Each functionality is separated into distinct services for easier maintenance and scaling. The database uses MySQL and is designed to efficiently support these functionalities while maintaining a high level of integrity and performance.

The frontend is structured around Vue3 components, and logically split views. Pinia is used for state management of the application, while Axios enables asynchronous communication with the backend. Vue Router is crucial for navigation within the app, providing a seamless user experience without the need for page refreshes.

The database design focuses on efficiency and scalability, with entities such as Users, Tasks, Projects, and Workspaces..., which are interconnected to support complex project and task management functionalities. The schema is (hopefully) carefully planned to support fast data access and straightforward queries, forming the foundation for a robust task management system.


## Demo and Documentation
Application can be accessed on the following link: [GitHub](http://307w123.e2.mars-hosting.com/)

Demo has limited functionality available without login - super basic functionality with tasks being kept in the localStorage (max 10 tasks).

> Overview of the envisioned app possibilities can be understood using the following **login details:**


> Username: taskenize@test.com  
> Password: Abcd123!  
> (Please do not attempt to change the password - you will not be able to proceed due to email functionality not being enabled.)


Also, you can feel free to consult some of the documentation related links listed below:

- [Database structure:](https://drive.google.com/file/d/12C9I5N8rUo2w6MeVaAs3YavWJoRIXnOU/view?usp=drive_link)

- FE_BE Contract:


[GitHub](https://docs.google.com/document/d/19u_XQ0LXa3V3HBpcbWQZtc-UkjMYKVgolsMGZbXUGAo/edit?usp=drive_link)

- Users and Permissions:


[GitHub](https://docs.google.com/spreadsheets/d/1dN_jyEfNSbEReMjKAUCieN-CDkB1aCsrzQemdgMoxjc/edit?usp=drive_link)

- UX screenshots from Figma:


[GitHub](https://drive.google.com/drive/folders/1BRE-na_T7RnDtNefDWGkXG-dlf-2urSh?usp=drive_link)

- Use cases:


[GitHub](https://drive.google.com/drive/folders/1MK9CRqY_eozBhuExTfNfmLgq8f9iVad_?usp=drive_link)


## Development Environment
The project was developed using the MARS engine, a serverless technology that allows focusing on application development instead of DevOps tasks. The backend code is written in JavaScript, while MARS is responsible for managing infrastructure and deployment.


## Licence
The project is licensed under the MIT license.

## Contact
For additional information, questions, or collaboration opportunities, feel free to contact me at: [irena.popovic07@gmail.com]
