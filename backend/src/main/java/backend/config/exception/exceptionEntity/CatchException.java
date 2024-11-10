//package backend.config.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.dao.DataIntegrityViolationException;
//
//import org.springframework.web.client.RestClientException;
//
//import java.nio.file.AccessDeniedException;
//
//@ControllerAdvice
//public class CatchException {
//
//    // Xử lý lỗi tài khoản không tìm thấy (Account Not Found)
//    // Handle the case where the account is not found
//    @ExceptionHandler(AccountException.class)
//    public ResponseEntity<ErrorResponse> handleAccountException(AccountException ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
//    }
//
//    // Xử lý lỗi nhóm xếp hạng không tìm thấy (Ranking Group Not Found)
//    // Handle the case where the ranking group is not found
//    @ExceptionHandler(RankingGroupException.class)
//    public ResponseEntity<ErrorResponse> handleRankingGroupException(RankingGroupException ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
//    }
//
//    // Xử lý lỗi khi dữ liệu đầu vào không hợp lệ (Validation Error)
//    // Handle the case of input validation errors
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
//        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
//        ErrorResponse er = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), errorMessage);
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
//    }
//
//    // Xử lý lỗi vi phạm cơ sở dữ liệu (Database Integrity Violation)
//    // Handle the case of database integrity violation
//    @ExceptionHandler(DataIntegrityViolationException.class)
//    public ResponseEntity<ErrorResponse> handleDatabaseException(DataIntegrityViolationException ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.CONFLICT.value(), "Lỗi cơ sở dữ liệu: " + ex.getMostSpecificCause().getMessage());
//        return ResponseEntity.status(HttpStatus.CONFLICT).body(er);
//    }
//
//    // Xử lý lỗi khi truy cập bị từ chối (Access Denied)
//    // Handle the case of access being denied
//    @ExceptionHandler(AccessDeniedException.class)
//    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.FORBIDDEN.value(), "Từ chối truy cập: " + ex.getMessage());
//        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(er);
//    }
//
//    // Xử lý lỗi với các dịch vụ bên ngoài (External Service Error)
//    // Handle the case of external service errors
//    @ExceptionHandler(RestClientException.class)
//    public ResponseEntity<ErrorResponse> handleRestClientException(RestClientException ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.SERVICE_UNAVAILABLE.value(), "Dịch vụ bên ngoài không khả dụng: " + ex.getMessage());
//        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(er);
//    }
//
//    // Xử lý các lỗi chung chung khác (General Exception)
//    // Handle other general exceptions
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
//        ErrorResponse er = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
//    }
//}
