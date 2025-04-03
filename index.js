import express from 'express';  
import Hello from "./Hello.js" 
import Lab5 from "./Lab5/index.js";   
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import session from 'express-session';
import 'dotenv/config';
import { initializeDatabase } from "./Kambaz/Database/init.js";

// Initialize database
console.log("Initializing database...");
initializeDatabase();
console.log("Database initialization complete");

const app = express();

// Set CORS to allow credentials
app.use(cors({
  origin: process.env.NETLIFY_URL || 'http://localhost:5173', // use environment variable
  credentials: true // allow credentials
})); 

app.use(express.json());

// Set session options
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production
};

// Adjust cookie settings in production
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

// Add session middleware support
app.use(session(sessionOptions));

// Register routes
UserRoutes(app);
CourseRoutes(app);        // Register course routes
ModuleRoutes(app);        // Register module routes
AssignmentRoutes(app);    // Register assignment routes
EnrollmentRoutes(app);    // Register enrollment routes
Lab5(app);
Hello(app);

// Start server
app.listen(process.env.PORT || 4000);
