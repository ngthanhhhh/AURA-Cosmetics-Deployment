package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.UserProfileResponse;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor

public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //UC3.7 - Customer tự đổi mật khẩu của mình
    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request){

        //Validate input
        if(request == null ||
            request.getOldPassword() == null || request.getOldPassword().isBlank() || request.getNewPassword() == null || request.getNewPassword().isBlank() || request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        //Tìm user theo email lấy từ SecurityContext
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        if(!user.getIsActive()){
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        //Xác minh mật khẩu cũ
        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new BadRequestException("Mật khẩu cũ không chính xác");
        }

        //Check mật khẩu xác nhận
        if(!request.getNewPassword().equals(request.getConfirmPassword())){
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }

        // Check độ dài
        if (request.getNewPassword().length() < 6){
            throw new BadRequestException("Mật khẩu  phải có ít nhất 6 ký tự");
        }

        // Check chữ + số
        if(!request.getNewPassword().matches("^(?=.*[A-Za-z])(?=.*\\\\d).+$")){
            throw new BadRequestException("Mật khẩu phải chứa chữ và số");
        }

        //Mật khẩu mới không được trùng mật khẩu cũ
        if(passwordEncoder.matches(request.getNewPassword(), user.getPassword())){
            throw new BadRequestException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        //Mã hóa và lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserProfileResponse getProfileByEmail(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if(!user.getIsActive()){
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
    }

}
