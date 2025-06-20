// Librarys
import { useNavigate } from "react-router";

// Component
const AuthRegister = () => {
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
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            className="form-control form-rounded-xl block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="emadd" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Email Address
          </label>
          <input
            id="emadd"
            type="email"
            required
            className="form-control form-rounded-xl block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-6">
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
        <button
          type="submit"
          className="w-full bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary-dark transition"
        >
          Sign Up
        </button>
      </form>
    </>
  );
};

export default AuthRegister;