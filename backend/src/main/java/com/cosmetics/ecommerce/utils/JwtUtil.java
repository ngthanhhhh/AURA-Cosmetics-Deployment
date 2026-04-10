package com.cosmetics.ecommerce.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

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

    // doc role tu token
    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    public String extractEmail(String token){
        return extractAllClaims(token).getSubject();
    }


    //kiem tra token con hop le khong
    public boolean isTokenValid(String token){
        try{
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());

        }catch(JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
