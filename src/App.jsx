import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewTicket from './pages/NewTicket'
import Tickets from './pages/Tickets'
import Ticket from './pages/Ticket'
import { useSelector } from 'react-redux'

// Super Agent Imports
import SuperAgentDashboard from './pages/superagent/SuperAgentDashboard'
import Analytics from './pages/superagent/Analytics'
import AllTickets from './pages/superagent/AllTickets'
import SuperAgentTicket from './pages/superagent/SuperAgentTicket'


function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            
            {/* User Routes */}
            <Route path='/new-ticket' element={<PrivateRoute />} >
              <Route path='/new-ticket' element={<NewTicket />} />
            </Route>
            <Route path='/tickets' element={<PrivateRoute />} >
              <Route path='/tickets' element={<Tickets />} />
            </Route>
            <Route path='/ticket/:ticketId' element={<PrivateRoute />} >
              <Route path='/ticket/:ticketId' element={<Ticket />} />
            </Route>

            {/* Super Agent Routes */}
            <Route 
              path="/superagent" 
              element={
                user && user.role === 'superAgent' ? <SuperAgentDashboard /> : <Navigate to="/login" />
              }
            >
              <Route path="analytics" element={<Analytics />} />
              <Route path="tickets" element={<AllTickets />} />
              <Route path="ticket/:ticketId" element={<SuperAgentTicket />} />
              {/* Redirect base /superagent to analytics */}
              <Route index element={<Navigate to="analytics" />} /> 
            </Route>
            
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App