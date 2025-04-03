import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // Get all courses a user is enrolled in
    app.get("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
        res.json(enrollments);
    });

    // Get all users enrolled in a course
    app.get("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // Enroll a user in a course
    app.post("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const { courseId } = req.body;
        
        if (!courseId) {
            res.status(400).send("courseId is required");
            return;
        }
        
        const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });

    // Unenroll a user from a course
    app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.sendStatus(204);
    });

    // Check if a user is enrolled in a course
    app.get("/api/users/:userId/enrollments/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        
        const isEnrolled = enrollmentsDao.isUserEnrolledInCourse(userId, courseId);
        res.json({ isEnrolled });
    });
}
