package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.AdminAccountRequest;
import com.cosmetics.ecommerce.dto.AdminAccountResponse;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class AdminAccountServiceImpl implements AdminAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    //lấy danh sách tất cả tài khoản admin đang hoạt động
    @Override
    public List<AdminAccountResponse> getAllAccounts(){
        //Lấy role ADMIN trong database
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseThrow(() -> new BadRequestException("Không tìm thấy role ADMIN"));

        //Lọc chỉ lấy user có role ADMIN, chuyển sang DTO rồi trả về
        return userRepository.findByRoleAndIsActiveTrue(adminRole)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    //Tạo tài khoản admin mới
    @Override
    @Transactional
    public AdminAccountResponse createAccount(AdminAccountRequest request){

        validateAdminAccountRequest(request, true);

        //Kiểm tra email đã tồn tại chưa
        if(userRepository.existsByEmail(request.getEmail())){
            throw new BadRequestException("Email đã tồn tại");
        }


        //Lấy role ADMIN từ database
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseThrow(() -> new BadRequestException("Không tìm thấy role ADMIN"));

        //Tạo user mới với role ADMIN
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        //mã hóa mật khẩu trước khi lưu
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(adminRole);
        user.setIsActive(true);

        //lưu vào database và trả về DTO
        return toResponse(userRepository.save(user));
    }

    //Cập nhật thông tin tài khoản (name, email, isActive)
    //Không sửa password ở đây
    @Override
    @Transactional
    public AdminAccountResponse updateAccount(Integer id, AdminAccountRequest request){

        validateAdminAccountRequest(request, false);

        //Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản"));

        // Kiểm tra email trùng (trừ chính nó)
        if(userRepository.existsByEmailAndUserIdNot(request.getEmail(),id)){
            throw new BadRequestException("Email đã tồn tại");
        }

        //Cập nhật thông tin
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        //Tránh lỗi null khi frontend không gửi isActive
        if(request.getIsActive() != null){
            user.setIsActive(request.getIsActive());
        }

        return toResponse(userRepository.save(user));
    }

    //Xóa mềm tài khoản (set isActive = false, không xóa khỏi database)
    @Override
    @Transactional

    public void deleteAccount(Integer id, String currentUserEmail){
        //Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản"));

        //Không cho xóa tài khoản đang đăng nhập
        if(user.getEmail().equals(currentUserEmail)){
            throw new BadRequestException("Không thể xóa tài khoản đang đăng nhập");
        }

        // Xóa mềm: chỉ set isActive = false
        user.setIsActive(false);
        userRepository.save(user);
    }

    //Đổi mật khẩu tài khoản Admin
    @Override
    @Transactional
    public void changePassword(Integer id, ChangePasswordRequest request){

        validateChangePassword(request);

        // Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản"));

        // Không trùng password cũ
        if(passwordEncoder.matches(request.getNewPassword(), user.getPassword())){
            throw new BadRequestException("Mật khẩu mới không được trùng mật khẩu cũ");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    // Chuyển đổi User entity sang AdminAccountResponse DTO
    // Không trả password về frontend
    private AdminAccountResponse toResponse(User user){
        return AdminAccountResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .createAt(user.getCreatedAt())
                .build();
    }

    //Xác thực đổi mật khẩu admin
    private void validateChangePassword(ChangePasswordRequest request){
        if(request == null ||
                request.getNewPassword() == null || request.getNewPassword().isBlank() || request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        if(request.getNewPassword().length() < 6){
            throw new BadRequestException("Mật khẩu phải có ít nhất 6 kí tự");
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())){
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }
    }

    //Xác thực dữ liệu admin (dùng chung cho create/update)
    private void validateAdminAccountRequest(AdminAccountRequest request, boolean isCreate){

        if(request == null){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        if(request.getName() == null || request.getName().isBlank()){
            throw new BadRequestException("Tên không được để trống");
        }

        if(request.getEmail() == null || request.getEmail().isBlank()){
            throw new BadRequestException("Email không được để trống");
        }

        if(!request.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")){
            throw new BadRequestException("Email không hợp lệ");
        }

        //chỉ check password khi tạo mới
        if(isCreate){
            if(request.getPassword() == null || request.getPassword().length() < 6){
                throw new BadRequestException("Password phải có ít nhất 6 ký tự");
            }

            //Bắt buộc có chữ + số
            if(!request.getPassword().matches("^(?=.*[A-Za-z])(?=.*\\d).+$")){
                throw new BadRequestException("Password phải chứa chữ và số");
            }
        }
    }
}
