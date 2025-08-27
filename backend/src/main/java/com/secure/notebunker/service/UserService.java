package com.secure.notebunker.service;

import com.secure.notebunker.dto.UserDTO;
import com.secure.notebunker.model.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    void updateUserRole(Long userId, String roleName);

    void updatePassword(Long userId, String password);

    void updateAccountLockStatus(Long userId, boolean lock);

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enable);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);
}
