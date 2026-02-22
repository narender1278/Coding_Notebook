import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import NoteBody from "../components/NoteBody";
import NotesNotFound from "../components/NotesNotFound";
import toast from "react-hot-toast";
import api from "../lib/axios";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.isloggedin) {
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("You must be logged in to view notes");
        } else {
          toast.error("Failed to fetch notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user.isloggedin]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Wrapper */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            Your Notes
          </h1>

          {/* <button
            onClick={() => (window.location.href = "/create")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            + New Note
          </button> */}
          <Link to="/create" className="btn btn-primary text-sm sm:text-base">
            <Plus className="size-4 sm:size-5" />
            <span>New Note</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-purple-600 py-8 sm:py-12 text-base sm:text-lg">
            Loading notes…
          </div>
        )}

        {/* If no notes found */}
        {!loading && notes.length === 0 && <NotesNotFound />}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {notes.map((note) => (
              <NoteBody key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
