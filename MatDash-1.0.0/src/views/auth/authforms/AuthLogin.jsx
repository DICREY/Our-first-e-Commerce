import { Link, useNavigate } from "react-router";

// Component
const AuthLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    navigate("/");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="Username" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Username
          </label>
          <input
            id="Username"
            type="text"
            required
            className="form-control form-rounded-xl block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="userpwd" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>
          <input
            id="userpwd"
            type="password"
            required
            className="form-control form-rounded-xl block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            <input
              id="accept"
              type="checkbox"
              className="checkbox accent-primary rounded focus:ring-primary"
            />
            <label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </label>
          </div>
          <Link to={"/"} className="text-primary text-sm font-medium">
            Forgot Password ?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary-dark transition"
        >
          Sign in
        </button>
      </form>
    </>
  );
};

export default AuthLogin;