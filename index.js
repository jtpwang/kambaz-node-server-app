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

// 初始化資料庫
console.log("初始化資料庫...");
initializeDatabase();
console.log("資料庫初始化完成");

const app = express();

// set cors to allow credentials
app.use(cors({
  origin: process.env.NETLIFY_URL || 'http://localhost:5173', // use environment variable
  credentials: true // allow credentials
})); 

app.use(express.json());

// set session options
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // in production environment, set to true
};

// adjust cookie settings in production environment
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

// add session middleware support
app.use(session(sessionOptions));

UserRoutes(app);
CourseRoutes(app);  // add course routes
ModuleRoutes(app);  // add module routes
AssignmentRoutes(app);  // add assignment routes
EnrollmentRoutes(app);  // add enrollment routes
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
