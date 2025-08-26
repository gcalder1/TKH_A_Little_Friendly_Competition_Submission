// frontend/src/utils/index.js
export function createPageUrl(page) {
  // Map logical page names to their corresponding route paths.
  // Route definitions in `src/pages/index.jsx` are case sensitive.
  // To avoid redirect loops, ensure that the paths returned here
  // exactly match the paths defined in the <Route> elements. For example,
  // 'Dashboard' maps to '/Dashboard' (capital D) because the router
  // defines <Route path="/Dashboard" ...>.
  const routes = {
    // The login page can be accessed via the root path. We leave this
    // mapping pointing at '/' so that links to HomeLogin take the user
    // to the root of the app.
    HomeLogin: '/',
    About: '/About',
    Signup: '/Signup',
    ProfileSetup: '/ProfileSetup',
    Dashboard: '/Dashboard',
    TasksPage: '/TasksPage',
    TaskSelect: '/TaskSelect',
    Completed: '/Completed',
    // Contact and Support are defined in lowercase in index.jsx
    Contact: '/contact',
    Support: '/support',
  };
  return routes[page] || '/';
}