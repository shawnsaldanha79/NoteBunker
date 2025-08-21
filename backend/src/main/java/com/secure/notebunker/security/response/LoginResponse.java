package com.secure.notebunker.security.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class LoginResponse {

    private String username;
    private List<String> roles;
    private String jwtToken;



}
