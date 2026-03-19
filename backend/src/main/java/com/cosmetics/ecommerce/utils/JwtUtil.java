package com.cosmetics.ecommerce.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
@Component

public class JwtUtil {

    //khoa bi mat de ky token
    private final String SECRET = "cosmeticsEcommerceSecretKey12345678";

    //thoi gian het han: 24 gio
    private final long EXPIRATION = 86400000;

    private SecretKey getKey(){
        return Keys.hmacShaKeyFor((SECRET.getBytes()));
    }

    //tao token sau khi login/register thanh cong
    public String generateToken(String email, String role){
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey())
                .compact();
    }

    //doc email tu token
    public String extractEmail(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // doc role tu token
    public String extractRole(String token){
        return (String) Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
    }

    //kiem tra token con hop le khong
    public boolean isTokenValid(String token){
        try{
            Jwts.parser()
                    .verifyWith(getKey())
                    .build()
                    .parseSignedClaims(token);
            return true;

        }catch(JwtException e){
            return false;
        }
    }
}
