import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LocationPage from "./pages/LocationPage";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage lat={57.70887} lon={11.97456} />,
  },
  {
    path: "/location/:lat/:lon",
    element: <LocationPage />,
  },
]);

export default AppRouter;
