import dataAnalytics from "@/assets/programs/data-analytics.jpg";
import pythonProgramming from "@/assets/programs/python-programming.jpg";
import machineLearning from "@/assets/programs/machine-learning.jpg";
import businessIntelligence from "@/assets/programs/business-intelligence.jpg";
import excelData from "@/assets/programs/excel-data.jpg";
import sqlDatabases from "@/assets/programs/sql-databases.jpg";

// Map program title keywords to thumbnail images
const thumbnailMap: Record<string, string> = {
  "data analytics": dataAnalytics,
  "python": pythonProgramming,
  "machine learning": machineLearning,
  "business intelligence": businessIntelligence,
  "excel": excelData,
  "sql": sqlDatabases,
};

export const getProgramThumbnail = (title: string): string => {
  const lower = title.toLowerCase();
  for (const [keyword, img] of Object.entries(thumbnailMap)) {
    if (lower.includes(keyword)) return img;
  }
  return dataAnalytics; // fallback
};
