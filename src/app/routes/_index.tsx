
export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Job Korea Food Map</h1>
      <p className="mb-4">
        Welcome to the Job Korea Food Map! Discover the best places to eat around Job Korea. Explore various restaurants and food spots recommended by our community of food enthusiasts.
      </p>
      <h2 className="text-2xl font-bold mb-2">Featured Creators</h2>
      <ul className="list-disc pl-5">
        <li className="mb-2">오동환(커넥션스쿼드) - PM</li>
        <li className="mb-2">이영철(FE플랫폼) - 프론트엔드 담당</li>
        <li className="mb-2">양지원(커넥션스쿼드) - 백엔드 담당</li>
        <li className="mb-2">유선영(FE플랫폼) - 디자인 담당</li>
      </ul>
    </div>
  );
};

export default AppRoot;
