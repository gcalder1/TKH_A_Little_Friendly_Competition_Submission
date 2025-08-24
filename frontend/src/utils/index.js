// frontend/src/utils/index.js
export function createPageUrl(page) {
  const routes = {
    HomeLogin: '/',
    About: '/about',
    Signup: '/signup',
    ProfileSetup: '/profile-setup',
    Dashboard: '/dashboard',
    TasksPage: '/tasks',
    TaskSelect: '/task-select',
    Completed: '/completed',
  };
  return routes[page] || '/';
}