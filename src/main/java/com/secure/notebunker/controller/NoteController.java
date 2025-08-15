package com.secure.notebunker.controller;

import com.secure.notebunker.model.Note;
import com.secure.notebunker.service.NoteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private static final Logger logger = LoggerFactory.getLogger(NoteController.class);

    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getUserNotes(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        logger.info("User: " + userDetails);
        return noteService.getNotesForUser(username);
    }

    @PostMapping
    public Note createNote(
            @RequestBody String content,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        logger.info("User: " + userDetails);
        return noteService.createNoteForUser(username, content);
    }

    @PutMapping("/{noteId}")
    public Note updateNote(
            @PathVariable Long noteId,
            @RequestBody String content,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        logger.info("User: " + username);
        return noteService.updateNoteForUser(noteId, username, content);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(
            @PathVariable Long noteId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        logger.info("User: " + username);
        noteService.deleteNoteForUser(noteId, username);
    }
}
