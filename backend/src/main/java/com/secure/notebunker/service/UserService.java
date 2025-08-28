package com.secure.notebunker.service;

import com.secure.notebunker.dto.UserDTO;
import com.secure.notebunker.model.User;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    User findByUsername(String username);

    Optional<User> findByEmail(String email);

    GoogleAuthenticatorKey generate2FASecret(Long userId);

    boolean validate2FACode(Long userId, Integer code);

    void enable2FA(Long userId);

    void disable2FA(Long userId);

    void updateUserRole(Long userId, String roleName);

    void updatePassword(Long userId, String password);

    void generatePasswordResetToken(String email);

    void updateAccountLockStatus(Long userId, boolean lock);

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enable);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);

    void resetPassword(String token, String newPassword);

    void registerUser(User newUser);
}
