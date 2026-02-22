import RichEditor from "../components/RichEditor";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { Link, useNavigate } from "react-router";

const Cpage = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(""); // Editor HTML content
  const navigate = useNavigate();

  const isEditorEmpty = (html) => {
    return !html || html === "<p></p>" || html === "<p><br></p>";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (isEditorEmpty(value)) {
      toast.error("Content is required");
      return;
    }

    try {
      await api.post("/notes", { title, content: value });
      toast.success("Note Created Successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  return (
    <div className="min-h-screen p-4">
      <Link to="/" className="btn btn-ghost mb-4">Back to Notes</Link>

      <div className="card bg-base-100 shadow p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Create New Note</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Note Title"
            className="input input-bordered w-full mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <RichEditor
            value={value}
            onChange={setValue}
          />

          <button className="btn btn-primary w-full mt-4" type="submit">
            Create Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cpage;
