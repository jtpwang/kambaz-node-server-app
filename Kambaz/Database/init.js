import Database from "./index.js";
import defaultCourses from "./courses.js";

/**
 * 初始化資料庫，確保有預設課程資料
 */
export function initializeDatabase() {
  console.log("檢查資料庫初始狀態...");
  
  // 檢查課程是否為空
  if (!Database.courses || Database.courses.length === 0) {
    console.log("課程資料為空，正在初始化預設課程...");
    
    // 載入預設課程
    Database.courses = [...defaultCourses];
    
    console.log(`成功初始化 ${Database.courses.length} 門預設課程`);
  } else {
    console.log(`資料庫中已有 ${Database.courses.length} 門課程，不需要初始化`);
  }
  
  // 此處可添加其他資料初始化邏輯（如果需要）
  
  return Database;
}

export default initializeDatabase;
