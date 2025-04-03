import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // 獲取用戶的所有註冊課程
    app.get("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForUser(userId);
        res.json(enrollments);
    });

    // 獲取課程的所有註冊用戶
    app.get("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
        res.json(enrollments);
    });

    // 用戶註冊課程
    app.post("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const { courseId } = req.body;
        
        if (!courseId) {
            res.status(400).send("需要提供 courseId");
            return;
        }
        
        const enrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });

    // 用戶退出課程
    app.delete("/api/users/:userId/enrollments/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.sendStatus(204);
    });

    // 檢查用戶是否已註冊課程
    app.get("/api/users/:userId/enrollments/:courseId", (req, res) => {
        const { userId, courseId } = req.params;
        
        const isEnrolled = enrollmentsDao.isUserEnrolledInCourse(userId, courseId);
        res.json({ isEnrolled });
    });
}
