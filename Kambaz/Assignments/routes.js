import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
    // create new assignment - specify course
    app.post("/api/courses/:courseId/assignments", (req, res) => {
        const { courseId } = req.params;
        const assignment = {
            ...req.body,
            course: courseId
        };
        const newAssignment = assignmentsDao.createAssignment(assignment);
        res.json(newAssignment);
    });

    // get all assignments for a specific course
    app.get("/api/courses/:courseId/assignments", (req, res) => {
        const { courseId } = req.params;
        const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    });

    // get all assignments
    app.get("/api/assignments", (req, res) => {
        const assignments = assignmentsDao.findAllAssignments();
        res.json(assignments);
    });

    // get specific assignment
    app.get("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignment = assignmentsDao.findAssignmentById(assignmentId);
        if (!assignment) {
            res.status(404).send("Assignment not found");
            return;
        }
        res.json(assignment);
    });

    // update assignment
    app.put("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const status = assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
        if (!status) {
            res.status(404).send("Assignment not found");
            return;
        }
        res.json(status);
    });

    // delete assignment
    app.delete("/api/assignments/:assignmentId", (req, res) => {
        const { assignmentId } = req.params;
        assignmentsDao.deleteAssignment(assignmentId);
        res.sendStatus(204);
    });
}
