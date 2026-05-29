package com.cosmetics.ecommerce.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import java.nio.charset.StandardCharsets;

/**
 * Component hỗ trợ tạo và kiểm tra JWT token.
 *
 * Class này được sử dụng trong quá trình xác thực người dùng,
 * bao gồm tạo token sau khi đăng nhập thành công,
 * đọc thông tin email, role từ token
 * và kiểm tra token còn hợp lệ hay không.
 */
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

    /**
     * Tạo JWT token sau khi người dùng đăng nhập thành công.
     *
     * Token chứa email người dùng, role,
     * thời điểm tạo token và thời điểm hết hạn.
     *
     * @param email Email của người dùng đăng nhập.
     * @param role Quyền của người dùng trong hệ thống.
     * @return JWT token dùng cho các request cần xác thực.
     */
    public String generateToken(String email, String role){
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey())
                .compact();
    }

    /**
     * Đọc toàn bộ thông tin được lưu trong JWT token.
     *
     * Hệ thống sẽ xác thực chữ ký token trước khi lấy dữ liệu.
     *
     * @param token JWT token cần đọc.
     * @return Các thông tin được lưu trong token.
     */
    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    /**
     * Lấy email người dùng từ JWT token.
     *
     * @param token JWT token cần đọc.
     * @return Email của người dùng.
     */
    public String extractEmail(String token){
        return extractAllClaims(token).getSubject();
    }

    /**
     * Lấy role người dùng từ JWT token.
     *
     * @param token JWT token cần đọc.
     * @return Role của người dùng.
     */
    public String extractRole(String token){
        return (String) extractAllClaims(token).get("role");
    }


    /**
     * Kiểm tra JWT token còn hợp lệ hay không.
     *
     * Token được xem là hợp lệ khi:
     * - Chữ ký token đúng.
     * - Token chưa hết hạn.
     *
     * @param token JWT token cần kiểm tra.
     * @return true nếu token hợp lệ, false nếu token sai hoặc hết hạn.
     */
    public boolean isTokenValid(String token){
        try{
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());

        }catch(JwtException | IllegalArgumentException e){
            return false;
        }
    }
}
