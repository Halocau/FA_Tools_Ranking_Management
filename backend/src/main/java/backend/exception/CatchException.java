package backend.exception;


import backend.model.ResponseError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CatchException {

    @ExceptionHandler
    public ResponseEntity<ResponseError> batLoiAll(Exception ex) {//responseEntity trả về 1 entity
        // nếu thằng nào có quăng lỗi này ra, là phương thức sẽ đc gọi để bắt nó lại
        ResponseError er = new ResponseError(HttpStatus.BAD_REQUEST.value(),ex.getMessage());
        //HttpStatus.BAD_REQUEST.value() => những truy vấn xấu, ko hợp lệ, tạo ra lỗi
        //ex.getMessage(): hiện ra thông tin lỗi
        // nghĩa là nó tự gán vào constructor có tham số
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(er);
        //cố tình trả về status Not_found, body(er): nội dung muốn gửi

    }
}
