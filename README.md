# 📝 Task Manager Application

Welcome to the **Task Manager Application**! This project is a comprehensive task management solution with user authentication and authorization using JWT tokens. The application consists of a **FastAPI backend** and a **React frontend with TypeScript and TailwindCSS**, providing a smooth and modern user experience. 🚀

---

## 🌟 Features

### 🛠️ Backend (FastAPI)

- **Authentication and Authorization**: Utilizes OAuth2 with JWT to ensure that only authenticated users can access the application.
- **Task CRUD**: Once authenticated, users can **Create, Read, Update, and Delete** tasks.
- **SQLite Database**: Stores user and task information in a lightweight SQLite database, ideal for development environments or lightweight applications.
- **Token Refresh**: Implements a token refresh logic to keep the session active.

### 🎨 Frontend (React + TypeScript + TailwindCSS)

- **Non-Responsive UI**: The UI is built with TailwindCSS, providing a simple and clean layout.
- **React Context and Reducer**: Manages global state with Context and Reducer for clear and maintainable logic.
- **Full CRUD Functionality**: Allows users to create, view, edit, and delete tasks directly from the interface.
- **Solid Backend Connection**: Communicates with the backend via `axios` for a seamless user experience.

---

## 🚀 Technologies Used

### Backend
- **FastAPI**: A fast web framework for building APIs with Python.
- **SQLite**: A lightweight, efficient database.
- **JWT (JSON Web Tokens)**: Provides secure user authentication.

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript.
- **TailwindCSS**: A utility-first CSS framework for styling.

---

## 📜 Main Endpoints

### Authentication

- **POST** `/user/register` - Register a new user.
- **POST** `/user/token` - Log in and obtain an access token.
- **POST** `/user/token/refresh` - Obtain a new access token using the refresh token.

### Task CRUD

- **GET** `/tasks/` - Retrieve all tasks for the authenticated user.
- **POST** `/tasks/` - Create a new task.
- **PATCH** `/tasks/{id}` - Update an existing task.
- **DELETE** `/tasks/{id}` - Delete a task.

---

## 🛡️ License

This project is licensed under the MIT License. Feel free to use and improve it!

---

Thank you for visiting this project. If you have any questions or comments, feel free to reach out by opening an issue!
