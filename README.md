# Members Management System - React App

A modern React application for managing members using a REST API built with Node.js and MySQL.

## Features

- **View All Members**: Display all members from the database
- **Add Member**: Create new members with unique names
- **Update Member**: Edit existing member names
- **Delete Member**: Remove members from the database
- **Search by ID**: Find a specific member by their ID
- **Limit Results**: Control the number of members displayed using the max parameter
- **Real-time Feedback**: Success and error messages for all operations
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## API Integration

This app connects to the REST API deployed at:
```
https://tp3-nodejs-rest-api.vercel.app/api/v1/members
```

### API Endpoints Used

- `GET /api/v1/members` - Fetch all members
- `GET /api/v1/members?max=N` - Fetch N members
- `GET /api/v1/members/:id` - Fetch a specific member
- `POST /api/v1/members` - Add a new member (body: `{name: "..."}`)
- `PUT /api/v1/members/:id` - Update a member (body: `{name: "..."}`)
- `DELETE /api/v1/members/:id` - Delete a member

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL (usually `http://localhost:5173`)

## Build for Production

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern features
- **Fetch API** - HTTP requests to the REST API

## Project Structure

```
A3_react_app/
├── src/
│   ├── App.jsx       # Main application component
│   ├── App.css       # Application styles
│   ├── index.css     # Global styles
│   └── main.jsx      # Application entry point
├── public/           # Static assets
├── package.json      # Dependencies and scripts
└── vite.config.js    # Vite configuration
```

## Usage

### Adding a Member
1. Enter a name in the "Add New Member" input field
2. Click "Add Member"
3. The new member will appear in the list

### Searching for a Member
1. Enter a member ID in the "Search Members" section
2. Click "Search by ID"
3. The specific member will be displayed

### Limiting Results
1. Enter a number in the "Max results" field
2. Click "Limit Results"
3. Only that number of members will be displayed

### Editing a Member
1. Click the "Edit" button next to a member
2. Modify the name in the input field
3. Click "Save" to confirm or "Cancel" to discard changes

### Deleting a Member
1. Click the "Delete" button next to a member
2. Confirm the deletion in the popup dialog
3. The member will be removed from the list

## License

ISC
