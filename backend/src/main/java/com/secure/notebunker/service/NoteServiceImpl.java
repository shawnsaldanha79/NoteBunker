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
    private final AuditLogService auditLogService;

    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository, AuditLogService auditLogService) {
        this.noteRepository = noteRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public List<Note> getNotesForUser(String username) {
        return noteRepository.findByOwnerUsername(username);
    }

    @Override
    @Transactional
    public Note createNoteForUser(String username, String content) {
        Note note = new Note();
        note.setContent(content);
        note.setOwnerUsername(username);
        Note savedNote = noteRepository.save(note);
        auditLogService.logNoteCreation(username, note);
        return savedNote;
    }

    @Override
    @Transactional
    public Note updateNoteForUser(Long noteId, String username, String content) {
        Note note = noteRepository.findById(noteId).orElseThrow(() ->
                new RuntimeException("Note not found")
        );
        note.setContent(content);
        Note updatedNote = noteRepository.save(note);
        auditLogService.logNoteUpdate(username, note);
        return updatedNote;
    }

    @Override
    @Transactional
    public void deleteNoteForUser(Long noteId, String username) {
        Note deletedNote = noteRepository.findById(noteId).orElseThrow(() ->
            new RuntimeException("Note not found")
        );
        auditLogService.logNoteDeletion(username, deletedNote);
        noteRepository.delete(deletedNote);
    }
}
