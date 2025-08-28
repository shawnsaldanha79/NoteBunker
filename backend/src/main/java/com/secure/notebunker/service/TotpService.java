package com.secure.notebunker.service;

import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public interface TotpService {

    GoogleAuthenticatorKey generateKey();

    String getQrCodeUrl(GoogleAuthenticatorKey secret, String username);

    boolean verifyCode(String secret, Integer code);
}
