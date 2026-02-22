import React, { useEffect, useState } from 'react'
import api from '../lib/axios';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, EditIcon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router';
import RichEditor from '../components/RichEditor';

const Vpage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Function to check if content has HTML tags
  const hasHtmlTags = (content) => {
    if (!content) return false;
    return /<[a-z][\s\S]*>/i.test(content);
  };

  // Function to convert plain text to HTML with line breaks
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

  // Function to convert HTML back to plain text (for editing)
  const formatHtmlToPlainText = (html) => {
    if (!html) return '';
    
    // Remove div wrapper if it's our simple div
    let text = html.replace(/^<div>(.*)<\/div>$/s, '$1');
    
    // Convert <br> tags back to newlines
    text = text.replace(/<br\s*\/?>/gi, '\n');
    
    // Remove any remaining HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Unescape HTML entities
    text = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    
    return text;
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);
        const noteData = response.data;
        
        // Format content if it's plain text
        if (noteData.content && !hasHtmlTags(noteData.content)) {
          noteData.content = formatPlainTextToHtml(noteData.content);
        }
        
        setNote(noteData);
      } catch (error) {
        console.log("Error in fetching the note", error);
        toast.error("Error in fetching the note. Please try again!");
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.log("Error while deleting the note:", error)
      toast.error("Error while deleting the note.")
    }
  }

  const handleSave = async () => {
    const { title, content } = note;
    if(!title?.trim() || !content?.trim()) {
      toast.error("Title and content are required");
      return;
    }
    
    setSaving(true);
    try {
      // Send formatted content to backend
      await api.put(`/notes/${id}`, {
        title,
        content
      });
      toast.success("Note updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.log("Error while updating the note:", error);
      toast.error("Error while updating the note.");
    } finally {
      setSaving(false);
    }
  }

  const handleEditorChange = (content) => {
    setNote({ ...note, content });
  }

  const getDisplayContent = () => {
    if (!note?.content) return '';
    
    // If in edit mode or content already has HTML tags, return as is
    if (isEditing || hasHtmlTags(note.content)) {
      return note.content;
    }
    
    // Otherwise format plain text for display
    return formatPlainTextToHtml(note.content);
  };

  // Get content for editor (convert back to plain text if it's our simple format)
  const getEditorContent = () => {
    if (!note?.content) return '';
    
    if (hasHtmlTags(note.content) && !note.content.includes('<p>') && !note.content.includes('<h')) {
      // It's our simple div format, convert back to plain text for editing
      return formatHtmlToPlainText(note.content);
    }
    
    return note.content;
  };

  if(loading) {
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10' />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/notes" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isEditing ? (
                  <>
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <EditIcon className="h-5 w-5 mr-2" />
                    Edit
                  </>
                )}
              </button>
              
              <button 
                onClick={handleDelete} 
                className="btn btn-error btn-outline"
              >
                <Trash2Icon className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Note title"
                    className="input input-bordered input-lg"
                    value={note?.title || ''}
                    onChange={(e) => setNote({...note, title: e.target.value})}
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800 p-3 bg-gray-50 rounded-lg">
                    {note?.title}
                  </h1>
                )}
              </div> 

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">
                    Content {isEditing ? '(Rich Text Editor)' : '(Preview)'}
                    {!isEditing && !hasHtmlTags(note?.content) && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (Plain text with line breaks)
                      </span>
                    )}
                  </span>
                </label>
                
                {isEditing ? (
                  <RichEditor
                    value={getDisplayContent()}
                    onChange={handleEditorChange}
                    readOnly={false}
                  />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-300 p-6 min-h-[400px]">
                    <div 
                      className="prose prose-lg max-w-none whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: getDisplayContent() || '<div class="text-gray-400 italic">No content available for this note.</div>' 
                      }}
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="card-actions justify-end border-t pt-6">
                  <button 
                    className="btn btn-ghost mr-2" 
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    disabled={saving} 
                    onClick={handleSave}
                  >
                    {saving ? (
                      <>
                        <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
              
              {!isEditing && note?.updatedAt && (
                <div className="text-sm text-gray-500 mt-4 pt-4 border-t">
                  Last updated: {new Date(note.updatedAt).toLocaleString()}
                  {!hasHtmlTags(note?.content) && (
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                      Plain Text Format
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Vpage;