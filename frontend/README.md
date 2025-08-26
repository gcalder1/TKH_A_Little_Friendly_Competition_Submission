## Plant Water Accountabiltiy App - FrontEnd

# 🌸 TidyBloom Frontend - React + Vite + Tailwind CSS

## 📸 Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="/demoScreenshots/demoSS1.png" alt="Screenshot 1" style="width: 48%; border-radius: 8px;" />
  <img src="/demoScreenshots/demoSS2.png" alt="Screenshot 2" style="width: 48%; border-radius: 8px;" />
  <img src="/demoScreenshots/demoSS3.png" alt="Screenshot 3" style="width: 48%; border-radius: 8px;" />
  <img src="/demoScreenshots/demoSS4.png" alt="Screenshot 4" style="width: 48%; border-radius: 8px;" />
</div>


A **gamified productivity frontend** that helps users complete cleaning tasks to grow virtual plants.  
Built with **modern React** and styled with **Tailwind CSS**.

---

## ✨ Features

- 🌱 **Plant Growth System**: Grow virtual plants by completing tasks  
- ✅ **Task Management**: Assign and complete cleaning tasks across different rooms  
- 🏆 **XP & Leveling**: Earn experience points and track progress through growth stages  
- 🎯 **Category Goals**: Complete weekly cleaning goals for bonus rewards  
- 📊 **Progress Tracking**: Visualize your productivity with charts and statistics  
- 🔐 **Secure Authentication**: JWT-based auth via Supabase  
- 🎨 **Beautiful UI**: Modern, responsive design with animations  

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18  
- **Build Tool**: Vite  
- **Styling**: Tailwind CSS + Tailwind Animate  
- **UI Components**: Radix UI Primitives + custom shadcn/ui-inspired components  
- **State Management**: React Query (TanStack Query)  
- **Forms**: React Hook Form + Zod validation  
- **Routing**: React Router v7  
- **Charts**: Recharts  
- **Icons**: Lucide React  
- **Notifications**: Sonner toast  
- **Authentication**: Supabase JavaScript Client  
- **HTTP Client**: Axios  
- **Date Handling**: date-fns  
- **Carousel**: Embla Carousel  

---

## 📦 Installation

Clone the repository:

```
git clone <repository-url>
cd frontend
```

## 📦 Installation

Install dependencies:

```
npm install
```

### Environment Setup

Create a .env file in the frontend directory:

```
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_API_BASE_URL=http://localhost:3001/api
 # or your backend URL
```

Start development server:

```
npm run dev
```

## 🔌 API Integration

```
Users: User management and profiles
Plants: Virtual plant growth and management
Tasks: Cleaning task definitions
UserTasks: User task assignments and completion
XPEvents: Experience point tracking
GrowthStageRequirements: Plant evolution requirements
CategoryGoals: Weekly cleaning challenges
```

## 🔐 Authentication Flow
- User signs in/up via Supabase Auth

- JWT token is stored securely

- Token is attached to all API requests via axios interceptors

- Protected routes verify authentication status

## 📱Responsive Design
The frontend is fully responsive and optimized for:

📱 Mobile devices

💻 Tablets

🖥 Desktop screens

## 🎮 Gamification Elements
- XP Awards: Earn experience for completed tasks

- Growth Stages: Plants evolve at specific XP thresholds

- Achievements: Complete category goals for bonuses

- Progress Visualization: See your productivity growth over time