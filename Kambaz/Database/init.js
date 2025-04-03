import Database from "./index.js";
import defaultCourses from "./courses.js";

/**
 * Initialize the database and ensure default course data exists
 */
export function initializeDatabase() {
  console.log("Checking initial database state...");
  
  // Check if courses are empty
  if (!Database.courses || Database.courses.length === 0) {
    console.log("Course data is empty, initializing default courses...");
    
    // Load default courses
    Database.courses = [...defaultCourses];
    
    console.log(`Successfully initialized ${Database.courses.length} default courses`);
  } else {
    console.log(`There are already ${Database.courses.length} courses in the database, no initialization needed`);
  }
  
  return Database;
}

export default initializeDatabase;
