import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getTicket, closeTicket } from '../../features/tickets/ticketSlice';
import { getNotes, createSuperAgentNote, reset as notesReset } from '../../features/notes/noteSlice';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';

function SuperAgentTicket() {
  const [noteText, setNoteText] = useState('');
  
  // Get data from the Redux store
  const { ticket, isLoading: ticketLoading, isError: ticketIsError, message: ticketMessage } = useSelector((state) => state.tickets);
  const { notes, isLoading: notesLoading, isError: notesIsError, message: notesMessage } = useSelector((state) => state.notes);
  
  const dispatch = useDispatch();
  const { ticketId } = useParams();

  useEffect(() => {
    // Handle errors from the store
    if (ticketIsError) {
      toast.error(ticketMessage);
    }
    if (notesIsError) {
      toast.error(notesMessage);
    }

    // Dispatch actions to fetch data
    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));

    // Cleanup function to reset state on unmount
    return () => {
      dispatch(notesReset());
    };
  }, [ticketIsError, notesIsError, ticketMessage, notesMessage, ticketId, dispatch]);
  
  const onNoteSubmit = (e) => {
    e.preventDefault();
    if (noteText.trim() === '') {
      toast.error('Note text cannot be empty');
      return;
    }
    dispatch(createSuperAgentNote({ noteText, ticketId }));
    setNoteText('');
  };

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success('Ticket Closed');
  };

  if (ticketLoading || notesLoading) {
    return <Spinner />;
  }

  if (ticketIsError || !ticket) {
      return <h3>Something went wrong fetching ticket data.</h3>
  }

  return (
    <div className="ticket-page-sa">
      <BackButton url='/superagent/tickets' />
      <header className="ticket-header-sa">
        <h2>
          Ticket ID: {ticket._id} <span className={`status status-${ticket.status}`}>{ticket.status}</span>
        </h2>
        <p>Product: <strong>{ticket.product}</strong></p>
        {/* Make sure ticket.user exists before trying to access its properties */}
        <p>Submitted by: <strong>{ticket.user?.name} ({ticket.user?.email})</strong></p>
        <p>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}</p>
        <hr />
        <div className="ticket-desc">
            <h3>Description of Issue</h3>
            <p>{ticket.description}</p>
        </div>
      </header>

      <div className="notes-section">
  <h3>Conversation History</h3>
  {notes.map((note) => (
    <div key={note._id} className={`note ${note.isStaff ? 'note-staff' : 'note-user'}`}>
      {/* === CHANGE IS HERE: Wrap header and date in a 'note-meta' div === */}
      <div className="note-meta">
        <div className={`note-header ${note.isStaff ? 'note-header-staff' : 'note-header-user'}`}>
          {note.isStaff ? <span>Super Agent (You)</span> : <span>{ticket.user?.name || 'User'}</span>}
        </div>
        <div className='note-date'>
          {new Date(note.createdAt).toLocaleString('en-US')}
        </div>
      </div>
      {/* ================================================================ */}
      <p>{note.text}</p>
    </div>
  ))}
        
        <form onSubmit={onNoteSubmit}>
            <div className="form-group">
                <textarea 
                    name="noteText" 
                    id="noteText"
                    className='form-control'
                    placeholder='Add a note to communicate with the user...'
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