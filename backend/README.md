# TidyBloom Backend — Express + Prisma + Supabase


This readme will contain the important infomrmation regarding our backend setup including information about:

- Prisma Models
- Route Information + Endpoint connections
- Auth/Auth setup

And much more!

## Backend API Endpoints Guide

This guide serves as a quick reference for all backend routes available in ```TidyBloom```. It includes endpoint URLs, their purpose, request method, expected inputs, and example responses.

---

### **1. Users (`users.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/users` | GET | Fetch all users with their plants, tasks, and XP events | None | Array of users with associated data |
| `/api/users/create` | POST | Create a new user | `{ username, email, passwordHash }` | Created user object |
| `/api/users/:id` | GET | Fetch a single user by ID | None | User object with plants, tasks, XP events |
| `/api/users/:id/update` | PUT | Update a user | `{ username?, email?, passwordHash?, onboardingComplete? }` | Updated user object |
| `/api/users/:id/delete` | DELETE | Delete a user | None | `{ message: "User deleted" }` |

---

### **2. Plants (`plants.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/plants` | GET | Fetch all plants with owner info | None | Array of plant objects |
| `/api/plants/:id` | GET | Fetch a single plant by ID | None | Plant object with owner info |
| `/api/plants/:id/generate` | POST | Create a new plant | `{ nickname?, growthStage, ownerId }` | Created plant object |
| `/api/plants/:id/updatePlantUnique` | PUT | Update a plant | `{ nickname?, growthStage?, health?, xp? }` | Updated plant object |
| `/api/plants/:id/delete` | DELETE | Delete a plant | None | `{ message: "Plant deleted successfully" }` |

---

### **3. Tasks (`tasks.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/tasks` | GET | Fetch all tasks | None | Array of tasks |
| `/api/tasks/:id` | GET | Fetch a single task by ID | None | Task object |
| `/api/tasks/room/:room` | GET | Fetch all tasks for a specific room | None | Array of tasks filtered by room |

---

### **4. UserTasks (`userTasks.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/userTasks/user/:userId` | GET | Fetch all tasks assigned to a user | Optional query: `?status=PENDING|COMPLETED|EXPIRED` | Array of UserTask objects with task details |
| `/api/userTasks/assignUserTask` | POST | Assign a task to a user | `{ userId, taskId }` | Created UserTask object with task and user info |
| `/api/userTasks/:id/complete` | PUT | Mark a task as complete and award XP | None | Updated UserTask object; logs XP in `xPEvent` table |
| `/api/userTasks/user/:userId/totalXP` | GET | Get total XP from completed tasks | None | `{ totalXP: number }` |
| `/api/userTasks/user/:userId/delete` | DELETE | Delete all tasks for a user (destructive) | None | `{ message: "Deleted X task(s) for user {userId}" }` |

---

### **5. XP Events (`xpEvents.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/xpEvents/user/:userId/xpEvents` | GET | Fetch all XP events for a user | Optional query: `?source=taskCompletion&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Array of XPEvent objects including associated UserTask and Task info |

> ⚠️ XP events are **immutable**: no routes for deleting or updating XP events exist.

---

### **6. Growth Stage Requirements (`growthStageRequirement.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/growthStageRequirement` | GET | Fetch all growth stages and required XP | None | Array of GrowthStageRequirement objects |
| `/api/growthStageRequirement/user/:userId/progress` | GET | Check a user's current growth stage and progress to next stage | None | `{ userId, totalXP, currentStage, nextStage, progressToNext }` |

---

### **7. Category Goals (`categoryGoals.js`)**

| Endpoint | Method | Purpose | Request Body / Query | Response |
|----------|--------|---------|-------------------|---------|
| `/api/categoryGoals` | GET | Fetch all category goals | None | Array of CategoryGoal objects |
| `/api/categoryGoals/:id` | GET | Fetch a single CategoryGoal by ID | None | CategoryGoal object |
| `/api/categoryGoals/checkProgress/:userId` | POST | Check goal completion for a user; awards XP if goal is met | None | `{ message: string, completedGoals: [CategoryGoal] }` |
| `/api/categoryGoals/:id` | PUT | Update a CategoryGoal | `{ room?, subcategory?, frequency?, requiredTasks?, isActive? }` | Updated CategoryGoal object |

---
