package com.cosmetics.ecommerce.service.impl;

import com.cosmetics.ecommerce.dto.AdminAccountRequest;
import com.cosmetics.ecommerce.dto.AdminAccountResponse;
import com.cosmetics.ecommerce.dto.ChangePasswordRequest;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.service.AdminAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Cài đặt nghiệp vụ quản lý tài khoản quản trị viên.
 *
 * Class này xử lý:
 * - Lấy danh sách tài khoản admin
 * - Tạo tài khoản admin
 * - Cập nhật thông tin admin
 * - Vô hiệu hóa tài khoản admin
 * - Đổi mật khẩu admin
 * - Khóa/mở khóa tài khoản admin
 */
@Service
@RequiredArgsConstructor

public class AdminAccountServiceImpl implements AdminAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy danh sách tài khoản admin có hỗ trợ:
     * - phân trang
     * - tìm kiếm theo tên/email
     * - lọc theo trạng thái hoạt động
     *
     * @param keyword Từ khóa tìm kiếm tên hoặc email.
     * @param isActive Trạng thái hoạt động của tài khoản.
     * @param pageable Thông tin phân trang và sắp xếp.
     * @return Danh sách tài khoản admin.
     */
    @Override
    public Page<AdminAccountResponse> getAllAccounts(String keyword, Boolean isActive, Pageable pageable){

        keyword = (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();

        //Lọc chỉ lấy user có role ADMIN, chuyển sang DTO rồi trả về
        return userRepository.findAdmins(keyword, isActive, pageable)
                .map(this::toResponse);

    }

    /**
     * Tạo tài khoản quản trị viên mới.
     *
     * Flow xử lý:
     * - Validate dữ liệu đầu vào
     * - Kiểm tra email đã tồn tại chưa
     * - Lấy ROLE_ADMIN từ database
     * - Mã hóa mật khẩu bằng BCrypt
     * - Lưu tài khoản mới vào database
     *
     * @param request Thông tin tài khoản admin cần tạo.
     * @return Thông tin tài khoản admin sau khi tạo.
     */
    @Override
    @Transactional
    public AdminAccountResponse createAccount(AdminAccountRequest request){

        validateAdminAccountRequest(request, true);

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // Kiểm tra email đã tồn tại chưa
        if(userRepository.existsByEmail(email)){
            throw new BadRequestException("Email đã tồn tại");
        }


        // Lấy role ADMIN từ database
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ROLE_ADMIN"));


        // Tạo user mới với role ADMIN
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(adminRole);
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        // Lưu vào database và trả về DTO
        return toResponse(userRepository.save(user));
    }

    /**
     * Cập nhật thông tin tài khoản admin.
     *
     * Không xử lý đổi mật khẩu tại API này.
     * Không cho phép admin tự vô hiệu hóa chính mình.
     *
     * @param id ID tài khoản admin cần cập nhật.
     * @param request Thông tin cần cập nhật.
     * @param currentUserEmail Email của admin đang đăng nhập.
     * @return Thông tin tài khoản sau khi cập nhật.
     */
    @Override
    @Transactional
    public AdminAccountResponse updateAccount(
            Integer id,
            AdminAccountRequest request,
            String currentUserEmail){

        validateAdminAccountRequest(request, false);

        String email = request.getEmail().trim().toLowerCase();

        // Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        if(!user.getRole().getRoleName().equals("ROLE_ADMIN")){
            throw new BadRequestException("Chỉ áp dụng cho tài khoản ADMIN");
        }

        // Kiểm tra email trùng (trừ chính nó)
        if(userRepository.existsByEmailAndUserIdNot(email,id)){
            throw new BadRequestException("Email đã tồn tại");
        }

        if(request.getIsActive() != null
                && !request.getIsActive()
                && user.getEmail().equalsIgnoreCase(currentUserEmail)){
            throw new BadRequestException("Không thể tự vô hiệu hóa tài khoản của mình");
        }

        // Cập nhật thông tin
        user.setName(request.getName().trim());
        user.setEmail(email);

        // Tránh lỗi null khi frontend không gửi isActive
        if(request.getIsActive() != null){
            user.setIsActive(request.getIsActive());
        }

        return toResponse(userRepository.save(user));
    }

    /**
     * Vô hiệu hóa tài khoản admin.
     *
     * Hệ thống không xóa dữ liệu khỏi database,
     * chỉ cập nhật isActive = false.
     *
     * Không cho phép admin tự vô hiệu hóa chính mình.
     *
     * @param id ID tài khoản admin cần vô hiệu hóa.
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    @Override
    @Transactional

    public void deleteAccount(Integer id, String currentUserEmail){
        // Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        if(!user.getRole().getRoleName().equals("ROLE_ADMIN")){
            throw new BadRequestException("Chỉ áp dụng cho tài khoản ADMIN");
        }

        // Không cho xóa tài khoản đang đăng nhập
        if(user.getEmail().equalsIgnoreCase(currentUserEmail)){
            throw new BadRequestException("Không thể vô hiệu hóa tài khoản của mình");
        }

        // Xóa mềm: chỉ set isActive = false
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Đổi mật khẩu tài khoản admin.
     *
     * Flow xử lý:
     * - Validate dữ liệu đổi mật khẩu
     * - Kiểm tra tài khoản tồn tại
     * - Kiểm tra role ADMIN
     * - Kiểm tra mật khẩu mới không trùng mật khẩu cũ
     * - Mã hóa và lưu mật khẩu mới
     *
     * @param id ID tài khoản admin cần đổi mật khẩu.
     * @param request Thông tin đổi mật khẩu.
     */
    @Override
    @Transactional
    public void changePassword(Integer id, ChangePasswordRequest request){

        validateChangePassword(request);

        String newPassword = request.getNewPassword().trim();

        // Tìm user theo id, nếu không có thì báo lỗi
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        if(!user.getRole().getRoleName().equals("ROLE_ADMIN")){
            throw new BadRequestException("Chỉ áp dụng cho tài khoản ADMIN");
        }

        // Không trùng password cũ
        if(passwordEncoder.matches(newPassword, user.getPassword())){
            throw new BadRequestException("Mật khẩu mới không được trùng mật khẩu cũ");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Chuyển đổi User entity sang AdminAccountResponse DTO.
     *
     * Không trả password về frontend để đảm bảo an toàn dữ liệu.
     *
     * @param user User entity.
     * @return DTO thông tin tài khoản admin.
     */
    private AdminAccountResponse toResponse(User user){
        return AdminAccountResponse.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    /**
     * Khóa hoặc mở khóa tài khoản admin.
     *
     * Không cho phép admin tự vô hiệu hóa chính mình.
     *
     * @param id ID tài khoản admin cần cập nhật trạng thái.
     * @param isActive Trạng thái mới của tài khoản.
     * @param currentUserEmail Email của admin đang đăng nhập.
     */
    @Override
    @Transactional
    public void updateStatus(Integer id, Boolean isActive, String currentUserEmail){

        if(isActive == null){
            throw new BadRequestException("Trạng thái không hợp lệ");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        //Check role trước
        if(!user.getRole().getRoleName().equals("ROLE_ADMIN")){
            throw new BadRequestException("Chỉ áp dụng cho tài khoản ADMIN");
        }

        if(user.getEmail().equalsIgnoreCase(currentUserEmail) && !isActive){
            throw new BadRequestException("Không thể tự vô hiệu hóa tài khoản của mình");
        }

        user.setIsActive(isActive);
        userRepository.save(user);
    }

    /**
     * Kiểm tra dữ liệu đổi mật khẩu admin hợp lệ.
     *
     * @param request Dữ liệu đổi mật khẩu từ frontend.
     */
    private void validateChangePassword(ChangePasswordRequest request){
        if(request == null ){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        String newPassword = request.getNewPassword() != null ? request.getNewPassword().trim() : null;
        String confirmPassword = request.getConfirmPassword() != null ? request.getConfirmPassword().trim() : null;

        if(newPassword == null || confirmPassword == null ||
           newPassword.isBlank() || confirmPassword.isBlank()){
            throw new BadRequestException("Mật khẩu không được để trống");
        }

        if(newPassword.length() < 6){
            throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        if(!newPassword.matches("^(?=.*[A-Za-z])(?=.*\\d).+$")){
            throw new BadRequestException("Mật khẩu phải chứa chữ và số");
        }

        if(!newPassword.equals(confirmPassword)){
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }
    }

    /**
     * Kiểm tra dữ liệu tài khoản admin hợp lệ.
     *
     * Dùng chung cho:
     * - tạo mới tài khoản admin
     * - cập nhật tài khoản admin
     *
     * @param request Dữ liệu tài khoản admin.
     * @param isCreate true nếu là tạo mới, false nếu là cập nhật.
     */
    private void validateAdminAccountRequest(AdminAccountRequest request, boolean isCreate){

        if(request == null){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        String email = request.getEmail() != null ? request.getEmail().trim() : null;
        String name = request.getName() != null ? request.getName().trim() : null;
        String password = request.getPassword() != null ? request.getPassword().trim() : null;

        if(name == null || name.isBlank()){
            throw new BadRequestException("Họ tên không được để trống");
        }

        if(email == null || email.isBlank()){
            throw new BadRequestException("Email không được để trống");
        }

        if(!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")){
            throw new BadRequestException("Email không hợp lệ");
        }

        // Chỉ check password khi tạo mới
        if(isCreate){
            if(password == null || password.length() < 6){
                throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
            }

            //Bắt buộc có chữ + số
            if(!password.matches("^(?=.*[A-Za-z])(?=.*\\d).+$")){
                throw new BadRequestException("Mật khẩu phải chứa chữ và số");
            }
        }
    }


}
