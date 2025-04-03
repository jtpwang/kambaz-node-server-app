import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
    app.get("/api/courses", (req, res) => {
        console.log("收到獲取所有課程的請求");
        const courses = dao.findAllCourses();
        console.log(`返回 ${courses.length} 門課程:`, courses);
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
        
        // 獲取當前用戶
        const currentUser = req.session["currentUser"];
        
        // 檢查用戶是否已登入
        if (!currentUser) {
            return res.status(401).json({ message: "您需要登入才能更新課程" });
        }
        
        // 檢查用戶角色是否為教師
        if (currentUser.role !== "FACULTY") {
            console.log(`用戶 ${currentUser.username} (角色: ${currentUser.role}) 嘗試更新課程，但被拒絕`);
            return res.status(403).json({ message: "只有教師可以更新課程" });
        }
        
        console.log(`教師 ${currentUser.username} 正在更新課程 ${courseId}:`, courseUpdates);
        const status = dao.updateCourse(courseId, courseUpdates);
        console.log(`成功更新課程:`, status);
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