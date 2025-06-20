// Librarys 
import { Link } from "react-router";

// Imports 
import ErrorImg from "../../../assets/images/backgrounds/errorimg.svg";

// Component 
const Error = () => {
  return (
    <>
      <div className="h-screen flex items-center justify-center bg-white dark:bg-darkgray">
        <div className="text-center">
          <img src={ErrorImg} alt="error" className="mb-4" />
          <h1 className="text-ld text-4xl mb-6">Opps!!!</h1>
          <h6 className="text-xl text-ld">
            This page you are looking for could not be found.
          </h6>
          <Link
            to="/"
            className="w-fit mt-6 mx-auto inline-block bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition"
          >
            Go Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Error;