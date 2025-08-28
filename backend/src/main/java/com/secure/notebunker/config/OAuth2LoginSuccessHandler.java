package com.secure.notebunker.config;

import com.secure.notebunker.model.AppRole;
import com.secure.notebunker.model.Role;
import com.secure.notebunker.model.User;
import com.secure.notebunker.repository.RoleRepository;
import com.secure.notebunker.security.jwt.JwtUtils;
import com.secure.notebunker.security.service.UserDetailsImpl;
import com.secure.notebunker.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;
    String username;
    String idAttributeKey;

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final RoleRepository roleRepository;

    @Autowired
    public OAuth2LoginSuccessHandler(UserService userService, JwtUtils jwtUtils, RoleRepository roleRepository) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.roleRepository = roleRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())
                || "google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();
            if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = attributes.getOrDefault("login", "").toString();
                idAttributeKey = "id";
            } else if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = email.split("@")[0];
                idAttributeKey = "sub";
            } else {
                username = "";
                idAttributeKey = "id";
            }
            System.out.println("HELLO OAUTH: " + email + " : " + name + " : " + username);
            userService.findByEmail(email).ifPresentOrElse(user -> {
                DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name())),
                        attributes,
                        idAttributeKey
                );
            }, () -> {
                User newUser = new User();
                Optional<Role> userRole = roleRepository.findByRoleName(AppRole.ROLE_USER);
                if (userRole.isPresent()) {
                    newUser.setRole(userRole.get());
                } else {
                    throw new RuntimeException("Default role not found");
                }
                newUser.setEmail(email);
                newUser.setUserName(username);
                newUser.setSignUpMethod(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                userService.registerUser(newUser);
                DefaultOAuth2User oAuth2User = new DefaultOAuth2User(
                        List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())),
                        attributes,
                        idAttributeKey
                );
                Authentication securityAuth = new OAuth2AuthenticationToken(
                        oAuth2User,
                        List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())),
                        oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
                );
                SecurityContextHolder.getContext().setAuthentication(securityAuth);
            });
        }
        this.setAlwaysUseDefaultTargetUrl(true);
        DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        System.out.println("OAuth2LoginSuccessHandler: " + username + " : " + email);
        Set<SimpleGrantedAuthority> authorities = oAuth2User.getAuthorities().stream().map(authority ->
                new SimpleGrantedAuthority(authority.getAuthority())).collect(Collectors.toSet());
        User user = userService.findByEmail(email).orElseThrow(() ->
                new RuntimeException("User not found")
        );
        authorities.add(new SimpleGrantedAuthority(user.getRole().getRoleName().name()));
        UserDetailsImpl userDetails = new UserDetailsImpl(
                null,
                username,
                email,
                null,
                false,
                authorities
        );
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", jwtToken)
                .build().toUriString();
        this.setDefaultTargetUrl(targetUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
