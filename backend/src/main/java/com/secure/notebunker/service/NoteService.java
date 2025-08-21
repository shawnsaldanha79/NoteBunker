package com.secure.notebunker.service;

import com.secure.notebunker.model.Note;

import java.util.List;

public interface NoteService {

    List<Note> getNotesForUser(String username);

    Note createNoteForUser(String username, String content);

    Note updateNoteForUser(Long noteId, String username, String content);

    void deleteNoteForUser(Long noteId, String username);

}
