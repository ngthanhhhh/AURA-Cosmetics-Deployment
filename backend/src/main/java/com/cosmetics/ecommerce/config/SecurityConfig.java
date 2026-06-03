package com.cosmetics.ecommerce.config;

import com.cosmetics.ecommerce.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;

/**
 * Cấu hình Spring Security cho toàn bộ hệ thống.
 *
 * Chức năng chính:
 * - Cấu hình xác thực bằng JWT
 * - Phân quyền truy cập theo role
 * - Cấu hình CORS cho frontend
 * - Xử lý lỗi xác thực và phân quyền
 * - Vô hiệu hóa Session và sử dụng Stateless Authentication
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Filter xử lý JWT cho các request yêu cầu xác thực.
     */
    private final JwtFilter jwtFilter;

    /**
     * Cấu hình các chính sách bảo mật của hệ thống.
     *
     * Bao gồm:
     * - Xác thực bằng JWT
     * - Phân quyền truy cập API
     * - Xử lý lỗi bảo mật
     * - Cấu hình Stateless Authentication
     *
     * @param http Đối tượng cấu hình bảo mật.
     * @return SecurityFilterChain của hệ thống.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"Bạn chưa đăng nhập hoặc token không hợp lệ\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"message\":\"Bạn không có quyền truy cập chức năng này\"}");
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/error",
                                "/uploads/**"
                        ).permitAll()

                        .requestMatchers("/api/v1/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/v1/payments/vnpay-return").permitAll()

                        .requestMatchers("/api/v1/admin/**").hasAuthority("ROLE_ADMIN")
                        
                        .requestMatchers("/api/v1/cart/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers("/api/v1/orders/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/payments/vnpay/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/products/*/reviews").hasAuthority("ROLE_CUSTOMER")

                        .requestMatchers("/api/v1/users/**").authenticated()

                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Cấu hình CORS cho frontend.
     *
     * Cho phép frontend React truy cập API backend
     * thông qua các HTTP method được hỗ trợ.
     *
     * @return Cấu hình CORS của hệ thống.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}