import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h2>Fábrica</h2>
          <span>Operação & custos</span>
        </div>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Dashboard
          </NavLink>
          <NavLink to="/clientes" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Clientes
          </NavLink>
          <NavLink to="/projetos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Projetos
          </NavLink>
          <NavLink to="/lancamentos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Lançamentos
          </NavLink>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
