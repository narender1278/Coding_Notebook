import Note from "../models/Note.js";
export const getAllNotes = async (req,res) => {
    try {
        const notes = await Note.find().sort({createdAt:-1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in notes fetching controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getNoteById = async (req,res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"The note is not available"})
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in note fetching controller",error);
        res.status(404).json({message:"Note Not found"});
    }
}

export const addNotes = async (req,res) => {
    try {
        const {title,content} = req.body;
        const newNote = new Note({title,content});
        await newNote.save();
        res.status(201).json({message:"Note is created succesfully"});
    } catch (error) {
       console.error("Error in notes adding controller",error);
        res.status(500).json({message:"Internal server error",error});
    }
}

export const updateNotes = async (req,res)=>{
    try {
        const {title,content} = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id,{title,content},{new:true});
        if(!updatedNote) return res.status(404).json({message:"The note is not available"})
        res.status(200).json({message:"Note is updated succesfully"});
    } catch (error) {
       console.error("Error in notes updating controller",error);
        res.status(500).json({message:"Internal server error",error});
    }
}

export const deleteNotes = async (req,res)=>{
    try {
        await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Note is deleted succesfully"});
    } catch (error) {
       console.error("Error in notes deleting controller",error);
        res.status(500).json({message:"Internal server error",error});
    }
}