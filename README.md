# School Management System

Welcome to the School Management System repository! This project is designed to streamline school-related tasks, offering features such as user authentication, class management, syllabus uploads, and user account management.

## Table of Contents

1. [Login Page](#login-page)
2. [Dashboard](#dashboard)
3. [Syllabus Upload Page](#syllabus-upload-page)
4. [Account Page](#account-page)
5. [General Guidelines](#general-guidelines)

## Login Page

The login page is the initial access point to the School Management System. Users need to provide their email and password for system access. Upon successful login, the system navigates to the dashboard using React Router.

## Dashboard

The dashboard provides an overview of user information and offers navigation options through a sidebar. Key features of the dashboard include:

- Display of user information.
- Navigation options: dashboard, syllabus, account, logout.
- Utilization of a smart table for managing school classes using a React table library (e.g., react-table).
- Inline editing functionality for modifying rows.
- "Add" and "Delete" options for effective class management.
- Sorting and search functionality for enhanced usability.

## Syllabus Upload Page

The syllabus upload page, accessible from the sidebar, enables users to upload syllabi. Key features include:

- Dropdowns for board, class, subject, and year selection.
- Form for metadata, including a brief description.
- Dynamic addition of topics and subtopics.
- Save button for storing the syllabus data in Firestore.

## Account Page

The account page, accessible from the sidebar, empowers users to manage their account settings. Key features include:

- Editable profile pictures and details.
- Custom validation for the username (start/end with alphabet, length 4-30, allowed special characters: {.-_}).
- Real-time updates of name and profile pictures in the sidebar.
- Appropriate validation for all form fields.

## General Guidelines

- Utilize a React UI library (e.g., Material-UI) for a consistent and visually appealing user interface.
- Implement React state management (e.g., useState) for handling user input and component states.
- Use React Context or Redux for global state management if necessary.
- Ensure responsive design for a seamless experience across various devices.
- Leverage Firebase as a backend framework to store the data fields.

Feel free to contribute, report issues, or provide feedback to enhance the School Management System!

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
