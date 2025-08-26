package com.secure.notebunker.service;

import com.secure.notebunker.model.AuditLog;
import com.secure.notebunker.model.Note;
import com.secure.notebunker.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Autowired
    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void logNoteCreation(String username, Note note) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("CREATE");
        auditLog.setUsername(username);
        auditLog.setNoteId(note.getId());
        auditLog.setNoteContent(note.getContent());
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }

    @Override
    @Transactional
    public void logNoteUpdate(String username, Note note) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("UPDATE");
        auditLog.setUsername(username);
        auditLog.setNoteId(note.getId());
        auditLog.setNoteContent(note.getContent());
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }

    @Override
    @Transactional
    public void logNoteDeletion(String username, Note note) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("DELETE");
        auditLog.setUsername(username);
        auditLog.setNoteId(note.getId());
        auditLog.setNoteContent(note.getContent());
        auditLog.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getAuditLogsForNoteId(Long id) {
        return auditLogRepository.findByNoteId(id);
    }
}
