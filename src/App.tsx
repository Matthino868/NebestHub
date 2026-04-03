import { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router";
import { useAuth } from "./Components/AuthProvider";
import DocuCheck from "./pages/DocuCheckPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectAccessPage from "./pages/ProjectAccessPage";
import "./assets/styles/portal-layout.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { LuHouse, LuFileCheck2, LuFolderOpen, LuInfo, LuMail } from "react-icons/lu";
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="portal-shell">
      <header className="portal-topbar">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <RxHamburgerMenu />
        </button>
        <div className="portal-brand" aria-label="Nebest Workspace">
          <img src="/Logo_Nebest_transparant.png" alt="Nebest" className="portal-brand-logo" />
          <span className="portal-brand-text">Workspace</span>
        </div>

        {currentUser ? (
          <div className="topbar-user">
            <div className="topbar-user-text">
              <span className="topbar-user-label">Signed in as</span>
              <strong className="topbar-user-name">{currentUser}</strong>
            </div>
            <button type="button" className="auth-logout" onClick={logout}>
              Logout
            </button>
          </div>
        ) : null}
      </header>

      {menuOpen ? <button type="button" className="side-overlay" onClick={closeMenu} aria-label="Close menu" /> : null}

      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <h2 className="side-title">Menu</h2>
        <nav className="menu-links">
          <NavLink
            to="/"
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
            end
          >
            <LuHouse className="menu-link-icon" />
            Home
          </NavLink>
          <NavLink
            to="/docucheck"
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            <LuFileCheck2 className="menu-link-icon" />
            DocuCheck
          </NavLink>
          <NavLink
            to="/projecten"
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            <LuFolderOpen className="menu-link-icon" />
            Projecten
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            <LuInfo className="menu-link-icon" />
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            <LuMail className="menu-link-icon" />
            Contact
          </NavLink>
        </nav>
      </aside>

      <main className="portal-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docucheck" element={<DocuCheck />} />
          <Route path="/projecten" element={<ProjectAccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
