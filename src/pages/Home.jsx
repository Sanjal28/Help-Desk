import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaTicketAlt,
  FaChartBar,
  FaTasks,
} from "react-icons/fa";
import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <section className="heading">
        {/* === CONDITIONAL HEADING TEXT === */}
        {user && user.role === "superAgent" ? (
          <>
            <h1>Super Agent Dashboard</h1>
            <p>Welcome, {user.name}. Manage tickets and view analytics.</p>
          </>
        ) : (
          <>
            <h1>Your help journey starts here</h1>
            <p>Tap an option to continue</p>
          </>
        )}
      </section>

      {/* === CONDITIONAL RENDERING FOR SUPER AGENT vs USER === */}
      {user && user.role === "superAgent" ? (
        <>
          {/* Super Agent View */}
          <Link
            to="/superagent/analytics"
            className="btn btn-reverse btn-block"
          >
            <FaChartBar />&nbsp;  View System Analytics
          </Link>
          <Link to="/superagent/tickets" className="btn btn-block">
            <FaTasks />&nbsp;  View All Tickets
          </Link>
        </>
      ) : (
        <>
          {/* Regular User View */}
          <Link to="/new-ticket" className="btn btn-reverse btn-block">
            <FaQuestionCircle /> Create New Ticket
          </Link>

          <Link to="/tickets" className="btn btn-block">
            <FaTicketAlt /> View My Tickets
          </Link>
        </>
      )}
    </>
  );
}

export default Home;

// import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";

// function Home() {
//   return (
//     <>
//       <section className="heading">
//         <h1>Your help journey starts here</h1>
//         <p>Tap an option to continue</p>
//       </section>

//       <Link to="/new-ticket" className="btn btn-reverse btn-block">
//         <FaQuestionCircle /> Create New Ticket
//       </Link>

//       <Link to="/tickets" className="btn btn-block">
//         <FaTicketAlt /> View My Tickets
//       </Link>
//     </>
//   );
// }

// export default Home;
