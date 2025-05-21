import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LocationPage from "./pages/LocationPage";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/location/:lat/:lon",
    element: <LocationPage />,
  },
]);

export default AppRouter;
