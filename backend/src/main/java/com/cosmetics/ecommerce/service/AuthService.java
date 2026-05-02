package com.cosmetics.ecommerce.service;
import com.cosmetics.ecommerce.exception.BadRequestException;
import com.cosmetics.ecommerce.dto.*;
import com.cosmetics.ecommerce.entity.Cart;
import com.cosmetics.ecommerce.entity.Role;
import com.cosmetics.ecommerce.entity.User;
import com.cosmetics.ecommerce.repository.RoleRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import com.cosmetics.ecommerce.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cosmetics.ecommerce.repository.CartRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final CartRepository cartRepository;
    private final AuthenticationManager authenticationManager;


    @Transactional
    // UC3.5 - Dang ky tai khoan (cho khach hang)

    public RegisterResponse register(RegisterRequest request){
        validateRegisterRequest(request);

        //Kiểm tra email đã tồn tại
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new BadRequestException("Email nay da duoc dang ky");

        }

        //Chuyển đổi dữ liệu từ Request sang Entity User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());

        Role customerRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                        .orElseThrow(() -> new BadRequestException("Loi: Khong tim thay quyen CUSTOMER trong he thong!"));

        user.setRole(customerRole);

        user.setIsActive(true);

        //Lưu vào Database
        User savedUser = userRepository.save(user);

        //tạo giỏ hàng trống cho User mới
        Cart cart = new Cart();
        cart.setUser(savedUser);
        cartRepository.save(cart);

        return new RegisterResponse("Đăng ký tài khoản thành công");
    }

    //Validate cho đăng ký
    private void validateRegisterRequest(RegisterRequest request){
        if (request == null){
            throw new BadRequestException("Dữ liệu không hợp lệ");
        }

        if (request.getName() == null || request.getName().isBlank()){
            throw new BadRequestException("Tên không được để trống");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()){
            throw new BadRequestException("Email không được để trống");
        }

        if(!request.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")){
            throw new BadRequestException("Email không hợp lệ");
        }

        if(request.getPhone() == null ||!request.getPhone().matches("^\\d{10}$")){
            throw new BadRequestException("SĐT phải là 10 số");
        }

        if(request.getPassword() == null || request.getPassword().length() < 6){
            throw new BadRequestException(("Password có ít nhất 6 kí tự"));
        }

        if(!request.getPassword().equals(request.getConfirmPassword())){
            throw new BadRequestException(("Mật khẩu xác nhận không khớp"));
        }

    }

    private void validateLoginRequest(LoginRequest request){
        if (request == null ||
            request.getEmail() == null || request.getEmail().isBlank() ||
                request.getPassword() == null || request.getPassword().isBlank()){
            throw new BadRequestException("Thiếu email hoặc password");
        }
    }


    // dang nhap Admin - dang nhap Customer
    public LoginResponse login (LoginRequest request){

        validateLoginRequest(request);

        //b1: xác thực email + password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        //b2: lấy user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy user"));

        //b3: kiểm tra tài khoản có bị khóa không
        if(!user.getIsActive()){
            throw new BadRequestException("Tài khoản đã bị khóa");
        }

        // b4. Tạo token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getRoleName());

        // 5. Trả về thông tin cho Frontend
        return new LoginResponse(
                token,
                user.getRole().getRoleName(),
                user.getName());
    }

}
