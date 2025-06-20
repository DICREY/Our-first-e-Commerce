import { RouterProvider } from "react-router";
import { ThemeModeScript } from 'flowbite-react'
import router from "./routes/Router";

// Component 
const App = () => {

  return (
    <>
      <ThemeModeScript />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
