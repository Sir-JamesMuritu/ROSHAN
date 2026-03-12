export interface Program {
  id: string;
  title: string;
  description: string;
  detailedSummary: string;
  duration: string;
  cost: string;
  status: "available" | "ongoing" | "ended" | "coming_soon";
  thumbnail: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "public" | "internal";
  active: boolean;
}

export const mockPrograms: Program[] = [
  {
    id: "1",
    title: "Data Analytics Professional",
    description: "Master data analysis with Excel, SQL, Power BI, and Python. Build real-world dashboards and gain industry-ready skills.",
    detailedSummary: "This comprehensive program covers the full data analytics pipeline — from data collection and cleaning to visualization and storytelling. You'll work with real datasets, build interactive dashboards in Power BI, write SQL queries, and automate tasks with Python. Ideal for career changers and professionals looking to upskill.",
    duration: "12 Weeks",
    cost: "KES 45,000",
    status: "available",
    thumbnail: "",
  },
  {
    id: "2",
    title: "Python for AI & Machine Learning",
    description: "Learn Python programming from scratch and progress into machine learning, deep learning, and AI model deployment.",
    detailedSummary: "Starting from Python fundamentals, this program guides you through NumPy, Pandas, Scikit-learn, TensorFlow, and model deployment. You'll build classification models, recommendation systems, and neural networks with hands-on projects throughout.",
    duration: "16 Weeks",
    cost: "KES 60,000",
    status: "available",
    thumbnail: "",
  },
  {
    id: "3",
    title: "Business Intelligence & Reporting",
    description: "Transform raw data into actionable business insights using Power BI, Tableau, and advanced Excel techniques.",
    detailedSummary: "Focused on business decision-making through data, this program teaches you to create compelling reports, automate data workflows, and present insights to stakeholders. You'll master DAX, data modeling, and advanced visualization techniques.",
    duration: "8 Weeks",
    cost: "KES 35,000",
    status: "ongoing",
    thumbnail: "",
  },
  {
    id: "4",
    title: "SQL & Database Management",
    description: "Build a strong foundation in relational databases, SQL querying, and database administration for data-driven roles.",
    detailedSummary: "From basic SELECT statements to complex joins, subqueries, and stored procedures — this course covers PostgreSQL and MySQL. You'll design normalized schemas, optimize queries, and manage production databases.",
    duration: "6 Weeks",
    cost: "KES 25,000",
    status: "available",
    thumbnail: "",
  },
  {
    id: "5",
    title: "Advanced Data Science Bootcamp",
    description: "An intensive program covering statistics, machine learning, NLP, and end-to-end data science project delivery.",
    detailedSummary: "Designed for learners with basic Python knowledge, this bootcamp dives deep into statistical modeling, feature engineering, NLP, time-series analysis, and deploying ML models via APIs. Capstone project included.",
    duration: "20 Weeks",
    cost: "KES 85,000",
    status: "coming_soon",
    thumbnail: "",
  },
  {
    id: "6",
    title: "Excel for Data Professionals",
    description: "Go beyond the basics with advanced formulas, pivot tables, Power Query, and VBA automation in Microsoft Excel.",
    detailedSummary: "This fast-paced program takes your Excel skills to the next level. Learn XLOOKUP, dynamic arrays, Power Query transformations, dashboard design, and VBA macros to automate repetitive tasks.",
    duration: "4 Weeks",
    cost: "KES 15,000",
    status: "available",
    thumbnail: "",
  },
];

export const mockNotifications: Notification[] = [
  { id: "1", message: "🎓 January 2026 Intake – Registration Now Open!", type: "public", active: true },
  { id: "2", message: "📢 Free Webinar: Introduction to Data Analytics – March 15, 2026", type: "public", active: true },
  { id: "3", message: "⏰ Early bird discount ends March 30 – Enroll now and save 15%!", type: "public", active: true },
];

export const currentIntake = {
  label: "March 2026 Intake",
  status: "Registration Open",
};
