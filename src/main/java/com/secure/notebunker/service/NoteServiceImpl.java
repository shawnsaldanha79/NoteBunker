package com.secure.notebunker.service;

import com.secure.notebunker.model.Note;
import com.secure.notebunker.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Note> getNotesForUser(String username) {
        return noteRepository.findByOwnerUsername(username);
    }

    @Override
    @Transactional
    public Note createNoteForUser(String username, String content) {
        Note note = new Note();
        note.setContent(content);
        note.setOwnerUsername(username);
        return noteRepository.save(note);
    }

    @Override
    @Transactional
    public Note updateNoteForUser(Long noteId, String username, String content) {
        Note note = noteRepository.findById(noteId).orElseThrow(() ->
                new RuntimeException("Note not found")
        );
        note.setContent(content);
        return noteRepository.save(note);
    }

    @Override
    @Transactional
    public void deleteNoteForUser(Long noteId, String username) {
        noteRepository.deleteById(noteId);
    }
}
