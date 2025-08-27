package com.secure.notebunker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.secure.notebunker.dto.UserDTO;
import com.secure.notebunker.model.Role;
import com.secure.notebunker.model.User;
import com.secure.notebunker.repository.RoleRepository;
import com.secure.notebunker.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @Autowired
    public AdminController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping("/getusers")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PutMapping("/update-role")
    public ResponseEntity<String> updateUserRole(
            @RequestParam Long userId,
            @RequestParam String roleName
    ) {
        userService.updateUserRole(userId, roleName);
        return new ResponseEntity<>("User role updated", HttpStatus.OK);
    }
    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(
            @RequestParam Long userId,
            @RequestParam String password
    ) {
        try {
            userService.updatePassword(userId, password);
            return new ResponseEntity<>("Password updated", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update-lock-status")
    public ResponseEntity<String> updateAccountLockStatus(
            @RequestParam Long userId,
            @RequestParam boolean lock
    ) {
        userService.updateAccountLockStatus(userId, lock);
        return new ResponseEntity<>("Account lock status updated", HttpStatus.OK);
    }
    @PutMapping("/update-expiry-status")
    public ResponseEntity<String> updateAccountExpiryStatus(
            @RequestParam Long userId,
            @RequestParam boolean expire
    ) {
        userService.updateAccountExpiryStatus(userId, expire);
        return new ResponseEntity<>("Account expiry status updated", HttpStatus.OK);
    }
    @PutMapping("/update-enabled-status")
    public ResponseEntity<String> updateAccountEnabledStatus(
            @RequestParam Long userId,
            @RequestParam boolean enabled
    ) {
        userService.updateAccountEnabledStatus(userId, enabled);
        return new ResponseEntity<>("Account enabled status updated", HttpStatus.OK);
    }
    @PutMapping("/update-credentials-expiry-status")
    public ResponseEntity<String> updateCredentialsExpiryStatus(
            @RequestParam Long userId,
            @RequestParam boolean expire
    ) {
        userService.updateCredentialsExpiryStatus(userId, expire);
        return new ResponseEntity<>("Credentials expiry status updated", HttpStatus.OK);
    }
}
