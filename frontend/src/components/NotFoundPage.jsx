import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgHYTFd4t9Ou4qhUh-8UsLXEVFexDvlc8KjA&s"
        alt="404 Not Found"
        className="h-64 mb-8"
        width={600}
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-4">Page Not Found</p>
      <Link
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        to="/home"
      >
        Go Back
      </Link>
    </div>
  );
};

export default NotFoundPage;
