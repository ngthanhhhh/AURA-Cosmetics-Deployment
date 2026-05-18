package com.cosmetics.ecommerce.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import java.nio.charset.StandardCharsets;

@Component

public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private long EXPIRATION;

    /**
     * Tạo khóa ký JWT từ secret key trong cấu hình ứng dụng.
     *
     * Secret key cần đủ dài để đảm bảo an toàn khi ký token.
     *
     * @return SecretKey dùng để ký và xác thực JWT.
     */

    private SecretKey getKey(){

        return Keys.hmacShaKeyFor((SECRET.getBytes(StandardCharsets.UTF_8)));
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

    public String extractRole(String token){
        return (String) extractAllClaims(token).get("role");
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
