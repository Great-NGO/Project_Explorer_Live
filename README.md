# Project Explorer Live

## Overview
The **NGO-TECH Project Explorer** is a full-stack web application built with the **MERN** stack (MongoDB, Express, React, Node.js). It allows users to manage and discover projects, interact with other users, and explore project details. The app includes features like user authentication, project creation, commenting, liking comments, and updating profiles and projects.

## Live Version
You can try out the live version of the application here:  
[Project Explorer Live](https://project-explorer-live.onrender.com/)

## Features
- **Authentication**: Secure user signup and login functionality.
- **Project Creation**: Create and manage projects.
- **Project Discovery**: Browse through a list of projects and view details.
- **Comments**: Leave comments on projects and interact with other users.
- **Like Comments**: Like comments left by others on projects.
- **User Profile**: Update your user profile with personal details and preferences.
- **Project Update**: Edit and update existing projects.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)

## Setup & Installation

### 1. Clone the repository:
```bash
git clone https://github.com/Great-NGO/Project_Explorer_Live.git
````

### 2. Install dependencies for both the frontend and backend:

#### Frontend:

```bash
cd client
npm install
```

#### Backend:

```bash
cd server
npm install
```

### 3. Set up environment variables:

Make sure to create a `.env` file in both the `client` and `server` directories with the appropriate values.

* **Server (.env):**

  * `PORT=5000`
  * `MONGODB_URI=your_mongo_connection_string`
  * `JWT_SECRET=your_jwt_secret`
* **Client (src/setupProxy.js):**

  * Change the 'target' value to point to whatever url your backend is sitting on, e.g. localhost:4000 or https://yourdomainname.com

### 4. Run the application:

#### Frontend:

```bash
cd client
npm start #or npm run dev, depending on your preference and setup
```

#### Backend:

```bash
#Make sure you are in the root directory
npm start #or npm run dev, depending on your preference and setup
```

### 5. Access the app:

Once both the frontend and backend are running, you can access the app at:
[http://localhost:3000](http://localhost:3000)

## Contributing

Feel free to fork the repository and submit pull requests for any improvements, bug fixes, or new features. If you encounter any issues, please report them using GitHub Issues.

### Steps to contribute:

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/Great-NGO/Project_Explorer_Live.git`
3. Create a feature branch: `git checkout -b feature-branch`
4. Make your changes and commit: `git commit -m "Add feature"`
5. Push to your fork: `git push origin feature-branch`
6. Open a pull request to the main repository.

## License

This project is licensed under the MIT License.
