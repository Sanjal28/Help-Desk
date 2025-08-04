import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ticketService from '../../features/tickets/ticketService';
import superAgentService from '../../features/superagent/superAgentService';
import Spinner from '../../components/Spinner';

function SuperAgentTicket() {
  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { ticketId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const ticketData = await ticketService.getTicket(ticketId, user.token);
        const notesData = await ticketService.getNotes(ticketId, user.token);
        setTicket(ticketData);
        setNotes(notesData);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch ticket data');
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [ticketId, user.token]);

  const onNoteSubmit = (e) => {
    e.preventDefault();
    superAgentService.addNote(ticketId, noteText, user.token)
        .then((newNote) => {
            setNotes([...notes, newNote]);
            setNoteText('');
            toast.success('Note added!');
        })
        .catch(() => toast.error('Failed to add note'));
  }

  const onTicketClose = () => {
      superAgentService.closeTicket(ticketId, user.token)
        .then((updatedTicket) => {
            setTicket(updatedTicket);
            toast.success('Ticket Closed');
        })
        .catch(() => toast.error('Failed to close ticket'));
  }

  if (loading) return <Spinner />;
  if (!ticket) return <h3>Ticket not found</h3>

  return (
    <div className="ticket-page-sa">
      <header className="ticket-header-sa">
        <h2>
          Ticket ID: {ticket._id} <span className={`status status-${ticket.status}`}>{ticket.status}</span>
        </h2>
        <p>Product: <strong>{ticket.product}</strong></p>
        <p>Submitted by: <strong>{ticket.user.name} ({ticket.user.email})</strong></p>
        <p>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}</p>
        <hr />
        <div className="ticket-desc">
            <h3>Description</h3>
            <p>{ticket.description}</p>
        </div>
      </header>

      <div className="notes-section">
        <h3>Conversation</h3>
        {notes.map((note) => (
           <div key={note._id} className={`note ${note.isStaff ? 'note-staff' : 'note-user'}`}>
               <div className={`note-header ${note.isStaff ? 'note-header-staff' : 'note-header-user'}`}>
                   {note.isStaff ? <span>SuperAgent</span> : <span>{ticket.user.name}</span>} said:
               </div>
               <p>{note.text}</p>
               <div className='note-date'>
                   {new Date(note.createdAt).toLocaleString('en-US')}
               </div>
           </div>
        ))}
        
        <form onSubmit={onNoteSubmit}>
            <div className="form-group">
                <textarea 
                    name="noteText" 
                    id="noteText"
                    className='form-control'
                    placeholder='Add a note...'
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                ></textarea>
            </div>
            <div className="ticket-actions">
                {ticket.status !== 'close' && (
                    <button type="button" className='btn btn-danger' onClick={onTicketClose}>Close Ticket</button>
                )}
                <button className='btn' type="submit">Add Note</button>
            </div>
        </form>
      </div>

    </div>
  );
}

export default SuperAgentTicket;