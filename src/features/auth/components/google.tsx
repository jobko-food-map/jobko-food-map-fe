function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Add your Google login logic here
    console.log('Google login clicked');
  };

  return (
    <button className='bg-white text-gray-800 p-2 rounded hover:bg-gray-200' onClick={handleGoogleLogin}>
      Google Login
    </button>
  );
}

export default GoogleLoginButton;
