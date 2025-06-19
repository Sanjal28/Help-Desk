import { useDispatch, useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import { getTicket, closeTicket } from "../features/tickets/ticketSlice";
import {
  getNotes,
  createNote,
  reset as notesReset,
} from "../features/notes/noteSlice";
import Spinner from "../components/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    borderRadius: "0.5rem",
    padding: "2rem",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
  }, [isError, message, ticketId, dispatch]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ ticketId, noteText }));
    closeModal();
  };

  if (isLoading || notesIsLoading) return <Spinner />;
  if (isError) return <h3>Something went wrong</h3>;

  return (
    <div className="max-w-4xl mx-auto px-5">
      <header className="mb-10 space-y-5">
        <BackButton url="/tickets" />
        <h2 className="text-xl font-semibold flex flex-wrap justify-between items-center gap-2">
          Ticket ID: {ticket._id}
          <span
            className={`px-3 py-1 text-sm rounded-full text-white ${
              ticket.status === "new"
                ? "bg-green-600"
                : ticket.status === "open"
                ? "bg-blue-600"
                : "bg-red-700"
            }`}
          >
            {ticket.status}
          </span>
        </h2>
        <h3 className="text-md text-gray-700">
          Date Submitted:{" "}
          {new Date(ticket.createdAt).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <h3 className="text-md text-gray-700">Product: {ticket.product}</h3>

        <hr className="my-4" />

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>

        <h2 className="text-xl font-semibold pt-6">Notes</h2>
      </header>

      {ticket.status !== "close" && (
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 mb-6 bg-black text-white rounded hover:scale-[0.98] transition"
        >
          <FaPlus />
          Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2 className="text-lg font-semibold mb-4">Add Note</h2>
        <button
          className="absolute top-4 right-4 text-lg text-gray-600 hover:text-red-600"
          onClick={closeModal}
        >
          ×
        </button>
        <form onSubmit={onNoteSubmit} className="space-y-4 mt-4">
          <div>
            <textarea
              name="noteText"
              id="noteText"
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-black text-white px-5 py-2.5 rounded-md hover:scale-[0.98] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      <div className="space-y-4">
        {notes.map((note) => (
          <NoteItem key={note._id} note={note} />
        ))}
      </div>

      {ticket.status !== "close" && (
        <button
          onClick={onTicketClose}
          className="w-full mt-8 bg-red-700 text-white px-5 py-2.5 rounded-md hover:scale-[0.98] transition"
        >
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
