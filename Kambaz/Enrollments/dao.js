import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// enroll user in course
export function enrollUserInCourse(userId, courseId) {
    // check if already enrolled
    const { enrollments } = Database;
    const isEnrolled = enrollments.find(
        (enrollment) => enrollment.user === userId && enrollment.course === courseId
    );
    
    // if not enrolled, create new enrollment
    if (!isEnrolled) {
        const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
        enrollments.push(newEnrollment);
        return newEnrollment;
    }
    
    return isEnrolled;
}

// unenroll user from course
export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = Database;
    Database.enrollments = enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
}

// get enrollments for user
export function findEnrollmentsForUser(userId) {
    const { enrollments, courses } = Database;
    const userEnrollments = enrollments.filter(
        (enrollment) => enrollment.user === userId
    );
    
    // get course details
    return userEnrollments.map(enrollment => {
        const course = courses.find(c => c._id === enrollment.course);
        return {
            _id: enrollment._id,
            user: enrollment.user,
            course: course
        };
    });
}

// get enrollments for course
export function findEnrollmentsForCourse(courseId) {
    const { enrollments, users } = Database;
    const courseEnrollments = enrollments.filter(
        (enrollment) => enrollment.course === courseId
    );
    
    // get user details
    return courseEnrollments.map(enrollment => {
        const user = users.find(u => u._id === enrollment.user);
        return {
            _id: enrollment._id,
            course: enrollment.course,
            user: user
        };
    });
}

// check if user is enrolled in course
export function isUserEnrolledInCourse(userId, courseId) {
    const { enrollments } = Database;
    return enrollments.some(
        (enrollment) => enrollment.user === userId && enrollment.course === courseId
    );
}