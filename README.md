Task Management Application
A React-based Task Management Application that allows users to create, update, delete, and organize tasks using a drag-and-drop interface. The app integrates with Firebase for authentication and data storage, and uses Zustand for state management.

Features
User Authentication:

Sign up, sign in, and log out.

Protected routes for authenticated users.

Task Management:

Create tasks with a title, description, due date, priority, and status.

Update or delete existing tasks.

Drag-and-drop tasks between columns (To Do, In Progress, Done).

Filtering and Sorting:

Filter tasks by status and priority.

Sort tasks alphabetically (ascending or descending).

Activity Logs:

Track all user activities (e.g., task creation, updates, deletions).

Responsive Design:

Works seamlessly on desktop and mobile devices.

Technologies Used
Frontend:

React

React Router (for routing)

React DnD (for drag-and-drop functionality)

Zustand (for state management)

Tailwind CSS (for styling)

Backend:

Firebase Authentication (for user authentication)

Firebase Firestore (for database)



Getting Started
Follow these steps to set up and run the application locally.

Prerequisites
Node.js (v16 or higher)

npm (v8 or higher)

Firebase project (for authentication and Firestore)

Installation
Clone the repository:

bash
Copy
git https://github.com/anands-github02/entries
cd task-management-app
Install dependencies:

bash
Copy
npm install
Set up Firebase:

Create a Firebase project at Firebase Console.

Add a web app to your Firebase project and copy the configuration object.

Create a .env file in the root directory and add your Firebase configuration:

env
Copy
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
Run the application:

bash
Copy
npm run dev
The app will be available at http://localhost:5173.

Folder Structure
Copy
task-management-app/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components (e.g., TaskCard, TaskColumn)
│   ├── pages/               # Page components (e.g., Dashboard, Signin, Signup)
│   ├── store/               # Zustand store (e.g., authStore)
│   ├── firebase.config.js   # Firebase configuration
│   ├── App.js               # Main application component
│   └── index.js             # Entry point
├── .env                     # Environment variables
├── .gitignore               # Files to ignore in Git
├── package.json             # Project dependencies
└── README.md                # Project documentation
Available Scripts
Start the development server:

bash
Copy
npm run dev


Build the project for production:

bash
Copy
npm run build
Testing
The application includes unit tests for components, state management, and Firebase interactions. To run the tests:


Deployment
To deploy the application, follow these steps:

Build the project:

bash
Copy
npm run build
Deploy the build folder to your preferred hosting service (e.g., Firebase ).

Firebase Hosting Example:

bash
Copy
firebase init hosting
firebase deploy
Contributing
Contributions are welcome! Follow these steps to contribute:

Fork the repository.

Create a new branch:

bash
Copy
git checkout -b feature/your-feature-name
Commit your changes:

bash
Copy
git commit -m "Add your feature"
Push to the branch:

bash
Copy
git push origin feature/your-feature-name
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
Firebase for backend services.

React DnD for drag-and-drop functionality.

Zustand for state management.

Live Preview - https://entries-1d96b.web.app/dashboard

Contact
For questions or feedback, feel free to reach out:

Sachidananda
Email: mgsachidananda@gmail.com

GitHub: anands-github02