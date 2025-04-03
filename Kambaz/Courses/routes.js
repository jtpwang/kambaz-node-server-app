import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
    app.get("/api/courses", (req, res) => {
        console.log("Received request to fetch all courses");
        const courses = dao.findAllCourses();
        console.log(`Returning ${courses.length} courses:`, courses);
        res.send(courses);
    });

    app.delete("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    });

    app.put("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;

        // Get current user
        const currentUser = req.session["currentUser"];

        // Check if user is logged in
        if (!currentUser) {
            return res.status(401).json({ message: "You must be logged in to update a course" });
        }

        // Check if user role is FACULTY
        if (currentUser.role !== "FACULTY") {
            console.log(`User ${currentUser.username} (role: ${currentUser.role}) attempted to update course but was denied`);
            return res.status(403).json({ message: "Only faculty members can update courses" });
        }

        console.log(`Faculty ${currentUser.username} is updating course ${courseId}:`, courseUpdates);
        const status = dao.updateCourse(courseId, courseUpdates);
        console.log("Course successfully updated:", status);
        res.send(status);
    });

    app.get("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });

    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });
}
