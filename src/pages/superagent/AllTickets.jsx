import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import superAgentService from '../../features/superagent/superAgentService';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';

function AllTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    superAgentService.getAllTickets(user.token)
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Could not fetch tickets');
        setLoading(false);
      });
  }, [user.token]);
  
  const handleTicketClick = (ticketId) => {
      navigate(`/superagent/ticket/${ticketId}`)
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="heading">All Customer Tickets</h1>
      <div className="tickets-list-container">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-item" onClick={() => handleTicketClick(ticket._id)}>
              <div className="product-name">{ticket.product}</div>
              <div className="user-name">{ticket.user.name}</div>
              <div>{new Date(ticket.createdAt).toLocaleDateString()}</div>
              <div className={`status status-${ticket.status}`}>{ticket.status}</div>
            </div>
          ))
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
}

export default AllTickets;