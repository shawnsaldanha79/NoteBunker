package com.secure.notebunker.service;

import com.secure.notebunker.dto.UserDTO;
import com.secure.notebunker.model.User;

import java.util.List;

public interface UserService {

    void updateUserRole(Long userId, String roleName);
    List<User> getAllUsers();
    UserDTO getUserById(Long id);
}
