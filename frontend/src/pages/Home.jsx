import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import RateLimiter from '../components/RateLimiter';
import { useState } from 'react';
import HomeBody from '../components/HomeBody';
import toast from "react-hot-toast";
import api from '../lib/axios';
import NotesNotFound from '../components/NotesNotFound';
const Home = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        if(error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to fetch notes");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);
  

  return (
    <div>
        <h1 className="min-h-screen">
            <Navbar />
            {isRateLimited && <RateLimiter/>}
            <div className="max-w-7xl mx-auto p-4 mt-6">
              {loading && <div className='text-center text-primary py-10'>Loading Notes...</div>}
              
              {notes.length===0 && !isRateLimited &&(
                <NotesNotFound />
              )}

              {notes.length>0 && !isRateLimited && (
                <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6'>
                  {notes.map((note)=>(
                      <HomeBody key={note._id} note={note} setNotes={setNotes}/>
                  ))}
                </div>
              )}
            </div>
        </h1>
    </div>
  )
}

export default Home