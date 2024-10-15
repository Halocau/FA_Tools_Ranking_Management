package backend.backend.exception;

import FA_tools.studentCrudAPI.handle.ResponseError;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class StudentException {


    // Xử lý lỗi khi đối tượng Student không tồn tại hoặc dữ liệu không hợp lệ (NullPointerException)
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ResponseError> handleNullPointerException(NullPointerException e) {
        ResponseError er = new ResponseError(HttpStatus.NOT_FOUND.value(), "Student not found or invalid data.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
    }

    // Xử lý lỗi vi phạm tính toàn vẹn dữ liệu (ví dụ: email bị trùng lặp) (DataIntegrityViolationException)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseError> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        ResponseError er = new ResponseError(HttpStatus.CONFLICT.value(), "Duplicate data or constraint violation.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(er);
    }

    // Xử lý lỗi khi dữ liệu không hợp lệ (MethodArgumentNotValidException)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseError> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(), "Validation failed for the provided data.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
    }

    // Xử lý lỗi khi không tìm thấy sinh viên theo id (EntityNotFoundException)
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseError> handleEntityNotFoundException(EntityNotFoundException e) {
        ResponseError er = new ResponseError(HttpStatus.NOT_FOUND.value(), "Student not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(er);
    }

    // Xử lý lỗi khi JSON không hợp lệ hoặc bị sai cú pháp (HttpMessageNotReadableException)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseError> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(), "Malformed JSON request.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
    }

    // Xử lý các lỗi chung khác
    @ExceptionHandler
    public ResponseEntity<ResponseError> allExceptions(Exception e) {
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        return ResponseEntity.badRequest().body(er);
    }

}



