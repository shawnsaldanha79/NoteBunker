package com.secure.notebunker.service;

import com.secure.notebunker.model.AuditLog;
import com.secure.notebunker.model.Note;

import java.util.List;

public interface AuditLogService {

    void logNoteCreation(String username, Note note);

    void logNoteUpdate(String username, Note note);

    void logNoteDeletion(String username, Note note);

    List<AuditLog> getAllAuditLogs();

    List<AuditLog> getAuditLogsForNoteId(Long id);
}
