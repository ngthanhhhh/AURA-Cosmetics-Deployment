package com.cosmetics.ecommerce.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MissingServletRequestParameterException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler({org.springframework.dao.DataAccessException.class, java.sql.SQLException.class})
    public ResponseEntity<Map<String, String>> handleDatabaseError(Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("message", "Không thể tải dữ liệu. Vui lòng thử lại sau!"));

    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingParam(MissingServletRequestParameterException ex){
        if("type".equals(ex.getParameterName())){
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Vui lòng chọn loại thống kê (DAY, WEEK, hoặc MONTH)"));
        }

        return ResponseEntity.badRequest()
                .body(Map.of("message", "Thiếu tham số bắt buộc: " + ex.getParameterName()));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMisMatch(MethodArgumentTypeMismatchException ex){
        if("type".equals(ex.getName())){
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Loại thống kê không hợp lệ. Chỉ hỗ trợ DAY, WEEK hoặc MONTH"));
        }

        return ResponseEntity.badRequest()
                .body(Map.of("message", "Tham số không hợp lệ: " + ex.getName()));
    }
}
