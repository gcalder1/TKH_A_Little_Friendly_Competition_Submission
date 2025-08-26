import Layout from "./Layout.jsx";

import HomeLogin from "./HomeLogin";

import TaskSelect from "./TaskSelect";

import Completed from "./Completed";
import Signup from "./Signup";

import About from "./About";

import TasksPage from "./TasksPage";

import ProfileSetup from "./ProfileSetup";

import Dashboard from "./Dashboard";

// Additional pages
import Contact from "./Contact";
import Support from "./Support";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    HomeLogin: HomeLogin,
    
    TaskSelect: TaskSelect,
    
    Completed: Completed,
    
    About: About,
    
    TasksPage: TasksPage,
    
    ProfileSetup: ProfileSetup,
    
    Dashboard: Dashboard,
    Signup: Signup,

    Contact: Contact,
    Support: Support,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<HomeLogin />} />
                
                
                <Route path="/HomeLogin" element={<HomeLogin />} />
                
                <Route path="/TaskSelect" element={<TaskSelect />} />
                
                <Route path="/Completed" element={<Completed />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/TasksPage" element={<TasksPage />} />
                
                <Route path="/ProfileSetup" element={<ProfileSetup />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/Signup" element={<Signup />} />

                {/* New routes for contact and support pages */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}