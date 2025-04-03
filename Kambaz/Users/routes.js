import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = (req, res) => {
        try {
            const newUser = dao.createUser(req.body);
            res.json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };
    
    const deleteUser = (req, res) => {
        const userId = req.params.userId;
        try {
            dao.deleteUser(userId);
            res.sendStatus(200);
        } catch (error) {
            res.status(404).json({ message: "User not found" });
        }
    };
    
    const findAllUsers = (req, res) => {
        try {
            const users = dao.findAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
    const findUserById = (req, res) => {
        const userId = req.params.userId;
        try {
            const user = dao.findUserById(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
    
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        
        // Check if user is logged in
        if (!currentUser) {
            return res.status(401).json({ message: "You must be logged in to create a course" });
        }
        
        // Check if user is a faculty member
        if (currentUser.role !== "FACULTY") {
            console.log(`User ${currentUser.username} (role: ${currentUser.role}) attempted to create a course but was denied`);
            return res.status(403).json({ message: "Only faculty members can create courses" });
        }
        
        console.log(`Faculty ${currentUser.username} is creating a new course:`, req.body);
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        console.log("Successfully created course:", newCourse);
        res.json(newCourse);
    };

    const findUsersEnrolledInCourse = (req, res) => {
        try {
            const courseId = req.params.courseId;
            console.log(`Searching for users enrolled in course ${courseId}`);
            
            // Get all enrollment records for the course
            const enrollmentsInCourse = enrollmentsDao.findEnrollmentsForCourse(courseId);
            console.log(`Found ${enrollmentsInCourse.length} enrollment records`);
            
            // Extract user objects directly from enrollments
            const users = enrollmentsInCourse.map(enrollment => enrollment.user);
            
            console.log(`Successfully extracted ${users.length} user records`);
            
            // Return the user list
            res.json(users);
        } catch (error) {
            console.error("Error fetching users for course:", error);
            res.status(500).json({ message: "Error fetching users for course" });
        }
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/courses/:courseId/users", findUsersEnrolledInCourse);
}
