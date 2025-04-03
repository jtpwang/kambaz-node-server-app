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
        
        // 檢查用戶是否已登入
        if (!currentUser) {
            return res.status(401).json({ message: "您需要登入才能創建課程" });
        }
        
        // 檢查用戶角色是否為教師
        if (currentUser.role !== "FACULTY") {
            console.log(`用戶 ${currentUser.username} (角色: ${currentUser.role}) 嘗試創建課程，但被拒絕`);
            return res.status(403).json({ message: "只有教師可以創建課程" });
        }
        
        console.log(`教師 ${currentUser.username} 正在創建新課程:`, req.body);
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        console.log(`成功創建課程:`, newCourse);
        res.json(newCourse);
    };

    const findUsersEnrolledInCourse = (req, res) => {
        try {
            const courseId = req.params.courseId;
            console.log(`正在查詢課程 ${courseId} 的成員`);
            
            // 獲取課程的所有註冊信息
            const enrollmentsInCourse = enrollmentsDao.findEnrollmentsForCourse(courseId);
            console.log(`找到 ${enrollmentsInCourse.length} 個註冊記錄`);
            
            // 直接從註冊記錄中提取用戶對象（而不是 ID）
            const users = enrollmentsInCourse.map(enrollment => enrollment.user);
            
            console.log(`成功提取 ${users.length} 個用戶信息`);
            
            // 返回用戶列表
            res.json(users);
        } catch (error) {
            console.error(`獲取課程用戶時出錯:`, error);
            res.status(500).json({ message: "獲取課程用戶時出錯" });
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