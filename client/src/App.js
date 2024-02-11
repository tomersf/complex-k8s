import { Routes, Route, Outlet, Link } from "react-router-dom";
import "./App.css";
import OtherPage from "./OtherPage";
import Fib from "./Fib";

export default function App() {
  return (
    <div className="App">
      <h1>Fib Calculator</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Fib />} />
          <Route path="/otherpage" element={<OtherPage />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <ul style={{ listStyle: "none" }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/otherpage">Otherpage</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
