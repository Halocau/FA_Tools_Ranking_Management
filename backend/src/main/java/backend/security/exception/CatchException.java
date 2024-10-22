package backend.security.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.web.client.RestClientException;

import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class CatchException {

    // Xử lý lỗi tài khoản không tìm thấy (Account Not Found)
    @ExceptionHandler(AccountException.class)
    public ResponseEntity<ResponseError> handleAccountException(AccountException ex) {
        ResponseError er = new ResponseError(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
    }

    // Xử lý lỗi nhóm xếp hạng không tìm thấy (Ranking Group Not Found)
    @ExceptionHandler(RankingGroupException.class)
    public ResponseEntity<ResponseError> handleRankingGroupException(RankingGroupException ex) {
        ResponseError er = new ResponseError(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
    }

    // Xử lý lỗi khi dữ liệu đầu vào không hợp lệ (Validation Error)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseError> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(), errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
    }

    // Xử lý lỗi vi phạm cơ sở dữ liệu (Database Integrity Violation)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseError> handleDatabaseException(DataIntegrityViolationException ex) {
        ResponseError er = new ResponseError(HttpStatus.CONFLICT.value(), "Lỗi cơ sở dữ liệu: " + ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(er);
    }

    // Xử lý lỗi khi truy cập bị từ chối (Access Denied)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseError> handleAccessDeniedException(AccessDeniedException ex) {
        ResponseError er = new ResponseError(HttpStatus.FORBIDDEN.value(), "Từ chối truy cập: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(er);
    }

    // Xử lý lỗi với các dịch vụ bên ngoài (External Service Error)
    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ResponseError> handleRestClientException(RestClientException ex) {
        ResponseError er = new ResponseError(HttpStatus.SERVICE_UNAVAILABLE.value(), "Dịch vụ bên ngoài không khả dụng: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(er);
    }

    // Xử lý các lỗi chung chung khác (General Exception)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseError> handleAllExceptions(Exception ex) {
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
    }
}
