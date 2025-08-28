package com.secure.notebunker.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TotpServiceImpl implements TotpService {

    private final GoogleAuthenticator googleAuthenticator;

    public TotpServiceImpl(GoogleAuthenticator googleAuthenticator) {
        this.googleAuthenticator = googleAuthenticator;
    }

    public TotpServiceImpl() {
        this.googleAuthenticator = new GoogleAuthenticator();
    }

    @Override
    public GoogleAuthenticatorKey generateKey() {
        return googleAuthenticator.createCredentials();
    }

    @Override
    public String getQrCodeUrl(GoogleAuthenticatorKey secret, String username) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL("NoteBunker App", username, secret);
    }

    @Override
    public boolean verifyCode(String secret, Integer code) {
        return googleAuthenticator.authorize(secret, code);
    }
}
