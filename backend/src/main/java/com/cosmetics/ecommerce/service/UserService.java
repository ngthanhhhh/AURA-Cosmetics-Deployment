package com.cosmetics.ecommerce.service;

import org.springframework.stereotype.Service;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; //Đã cấu hình trong SecurityConfig

    //Hàm xử lý đăng ký
    public User registerUsẻ(User user){
        //1. Kiem tra xem email da ton tai chua (để tránh lỗi Duplicate trong cơ sở dữ liệu)
        if (userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email da duoc su dung!");
        }

        //2. Mã hóa mật khẩu trước khi lưu
        String encodePassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodePassword);

        //3. Đảm bảo user luôn hoạt đọng khi mới tạo
        user.setIsActive(true);

        return userRepository.save(user);
    }

    //Hàm tìm user bằng email (dùng cho logic đăng nhập)
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
}
