import { Link } from 'react-router'
import { PenSquareIcon,Trash2Icon } from 'lucide-react'
import { formatDate } from "../lib/utils";
import api from '../lib/axios';
import toast from 'react-hot-toast';

const NoteBody = ({note,setNotes}) => {
  const deleteNote = async (e,id) => {
    e.preventDefault();
    if(!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); //get rid of the deleted one from ui
      toast.success("Note is succesfully deleted");
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete the note!!");
    }
  }

  const getDisplayContent = () => {
    if (!note?.content) return '';
    
    // If in edit mode or content already has HTML tags, return as is
    if (hasHtmlTags(note.content)) {
      return note.content;
    }
    
    // Otherwise format plain text for display
    return formatPlainTextToHtml(note.content);
  };

  const hasHtmlTags = (content) => {
    if (!content) return false;
    return /<[a-z][\s\S]*>/i.test(content);
  };

  const formatPlainTextToHtml = (content) => {
    if (!content) return '<div></div>';
    
    // If already has HTML tags, return as is
    if (hasHtmlTags(content)) {
      return content;
    }
    
    // Escape HTML entities to prevent XSS
    const escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Convert newlines to <br> and wrap in div
    const withLineBreaks = escapedContent.replace(/\n/g, '<br>');
    return `<div>${withLineBreaks}</div>`;
  };

  return (
    <Link to={`/view/${note._id}`} className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#0286db]">
        <div className='card-body p-3 sm:p-4 md:p-6'>
            <h3 className="card-title text-sm sm:text-base md:text-lg text-base-content">{note.title}</h3>
            <div 
                className="prose prose-sm sm:prose-base max-w-none whitespace-pre-wrap text-xs sm:text-sm text-base-content/70 line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: getDisplayContent(note.content) || '<div class="text-gray-400 italic">No content available for this note.</div>' 
                }}
              />
            {/* <p className="text-base-content/70 line-clamp-3">{}</p> */}
            <div className="card-actions justify-between items-center mt-2 sm:mt-3 md:mt-4">
                <span className="text-xs sm:text-sm text-base-content/60">
                    {formatDate(new Date(note.createdAt))}
                </span>
                <div className="flex items-center gap-1">
                    <PenSquareIcon className="size-3 sm:size-4" />
                    <button
                    className="btn btn-ghost btn-xs text-error" onClick={(e)=>deleteNote(e,note._id)}>
                    <Trash2Icon className="size-3 sm:size-4" />
                    </button>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default NoteBody;