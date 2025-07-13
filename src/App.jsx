import { useEffect } from "react";
import AdminUI from "./routes/Admin";
import Menu from "./routes/Menu";
import "./styles/App.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Menu />,
    },
    {
      path: "/menu/:id?",
      element: <Menu />,
    },
    {
      path: "/admin",
      element: <AdminUI />,
    },
   
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
