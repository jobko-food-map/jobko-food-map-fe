import { Link } from 'react-router';

const GNB = () => {
  const handleGoogleLogin = () => {
    // Add your Google login logic here
    console.log('Google login clicked');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-2xl text-white">
        <Link to="/">Logo</Link>
      </div>
      <button
        className="bg-white text-gray-800 p-2 rounded hover:bg-gray-200"
        onClick={handleGoogleLogin}
      >
        Google Login
      </button>
    </nav>
  );
};

export default GNB;