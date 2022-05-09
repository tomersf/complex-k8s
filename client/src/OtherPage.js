import { Link } from "react-router-dom";

const otherPage = () => {
  return (
    <div>
      I'm a test page!
      <Link to="/">Go back home</Link>
    </div>
  );
};

export default otherPage;