package com.secure.notebunker.controller;

import com.secure.notebunker.model.AppRole;
import com.secure.notebunker.model.Role;
import com.secure.notebunker.model.User;
import com.secure.notebunker.repository.RoleRepository;
import com.secure.notebunker.repository.UserRepository;
import com.secure.notebunker.security.jwt.JwtUtils;
import com.secure.notebunker.security.request.LoginRequest;
import com.secure.notebunker.security.request.SignupRequest;
import com.secure.notebunker.security.response.LoginResponse;
import com.secure.notebunker.security.response.MessageResponse;
import com.secure.notebunker.security.response.UserInfoResponse;
import com.secure.notebunker.security.service.UserDetailsImpl;
import com.secure.notebunker.service.TotpService;
import com.secure.notebunker.service.UserService;
import com.secure.notebunker.util.AuthUtil;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthUtil authUtil;
    private final TotpService totpService;

    @Autowired
    public AuthController(
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            UserService userService, AuthUtil authUtil, TotpService totpService
    ) {
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.authUtil = authUtil;
        this.totpService = totpService;
    }

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            ));
        } catch (AuthenticationException e) {
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad credentials");
            map.put("status", false);
            return new ResponseEntity<Object>(map, HttpStatus.NOT_FOUND);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);
        List<String> roles = authentication.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        LoginResponse response = new LoginResponse(userDetails.getUsername(), roles, jwtToken);
        return new ResponseEntity<Object>(response, HttpStatus.OK);
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUserName(signupRequest.getUsername())) {
            return new ResponseEntity<Object>(
                    new MessageResponse("Error: Username is already taken!"), HttpStatus.BAD_REQUEST
            );
        }
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return new ResponseEntity<Object>(
                    new MessageResponse("Error: Email is already in use!"), HttpStatus.BAD_REQUEST
            );
        }
        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword())
        );
        Set<String> strRoles = signupRequest.getRole();
        Role role = null;
        if (strRoles == null || strRoles.isEmpty()) {
            roleRepository.findByRoleName(AppRole.ROLE_USER).orElseThrow(() ->
                    new RuntimeException("Error: Role not found!")
            );
        } else {
            String roleStr = strRoles.iterator().next();
            if (roleStr.equals("admin")) {
                role = roleRepository.findByRoleName(AppRole.ROLE_ADMIN).orElseThrow(() ->
                        new RuntimeException("Error: Role not found!")
                );
            } else {
                role = roleRepository.findByRoleName(AppRole.ROLE_USER).orElseThrow(() ->
                        new RuntimeException("Error: Role not found!")
                );
            }
            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setCredentialsNonExpired(true);
            user.setEnabled(true);
            user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
            user.setAccountExpiryDate(LocalDate.now().plusYears(1));
            user.setTwoFactorEnabled(false);
            user.setSignUpMethod("email");
        }
        user.setRole(role);
        userRepository.save(user);
        return new ResponseEntity<Object>(
                new MessageResponse("User registered successfully"), HttpStatus.OK
        );
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        UserInfoResponse response = new UserInfoResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.isTwoFactorEnabled(),
                roles
        );
        return new ResponseEntity<Object>(response, HttpStatus.OK);
    }

    @GetMapping("/username")
    public ResponseEntity<?> currentUserName(@AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<Object>(userDetails != null ? userDetails.getUsername() : "",
                HttpStatus.OK
        );
    }

    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            userService.generatePasswordResetToken(email);
            return new ResponseEntity<>(new MessageResponse("Password reset email sent"),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(new MessageResponse("Error sending password reset email"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            userService.resetPassword(token, newPassword);
            return new ResponseEntity<>(new MessageResponse("Password reset successful"),
                    HttpStatus.OK
            );
        } catch (RuntimeException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new MessageResponse(e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA() {
        Long userId = authUtil.loggedInUserId();
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);
        String qrCodeUrl = totpService.getQrCodeUrl(
                secret,
                userService.getUserById(userId).getUserName()
        );
        return new ResponseEntity<>(qrCodeUrl, HttpStatus.OK);
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA() {
        Long userId = authUtil.loggedInUserId();
        userService.disable2FA(userId);
        return new ResponseEntity<>("2FA Disabled", HttpStatus.OK);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestParam Integer code) {
        Long userId = authUtil.loggedInUserId();
        boolean isValid = userService.validate2FACode(userId, code);
        if (isValid) {
            userService.enable2FA(userId);
            return new ResponseEntity<>("2FA verified", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid 2FA code", HttpStatus.OK);
        }
    }

    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FAStatus() {
        User user = authUtil.loggedInUser();
        if (user != null) {
            return new ResponseEntity<>(Map.of("is2faEnabled", user.isTwoFactorEnabled()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(
            @RequestParam Integer code,
            @RequestParam String jwtToken
    ) {
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);
        if (isValid) {
            return new ResponseEntity<>("2FA verified", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid 2FA code", HttpStatus.UNAUTHORIZED);
        }
    }
}
