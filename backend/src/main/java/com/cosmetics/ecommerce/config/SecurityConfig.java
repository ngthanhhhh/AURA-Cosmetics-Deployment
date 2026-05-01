package com.cosmetics.ecommerce.config;

import com.cosmetics.ecommerce.filter.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.AuthenticationProvider;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;


    // Cấu hình phân quyền truy cập
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws  Exception{
        http
//                Kich hoat cors
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // tắt csrf để gọi API t React/Postman không bị chặn
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth->auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/error"
                        ).permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ROLE_ADMIN") //Chỉ Admin mới vào được /admin
                        .requestMatchers("/api/v1/users/**").hasAuthority("ROLE_CUSTOMER") // Chỉ CUSTOMER mới vào được
                        .requestMatchers("/api/v1/products/**", "/api/v1/categories/**").permitAll() // Xem sản phẩm — public
                        .anyRequest().authenticated() //Các request khác phải đăng nhập
                )
                //Thêm filter của bạn vào trước bộ lọc mặc định của Spring
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

//    Định nghĩa cấu hình Cors chi tiết
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();

        //Cho phép địa chỉ của React
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        //Cho phép các phương thức HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        //Cho phép các Header (rất quan trọng khi dùng JWT)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        //Cho phép gửi Credentials (Cookie, Auth Header)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cấu hình này cho tất cả API
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
