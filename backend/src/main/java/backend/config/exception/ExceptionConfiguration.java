package backend.config.exception;

import java.nio.file.AccessDeniedException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import backend.config.exception.ErrorResponse;
import backend.config.exception.exceptionEntity.PageException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.log4j.Log4j2;

@ControllerAdvice
@Log4j2
public class ExceptionConfiguration extends ResponseEntityExceptionHandler {

    // Default exception
    @ExceptionHandler({Exception.class})
    public ResponseEntity<Object> handleAll(Exception exception) {
        String message = "Unexpected error";
        String detailMessage = exception.getLocalizedMessage();
        int code = 1;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Not found URL handler
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = "No handler found for " + exception.getHttpMethod() + " " + exception.getRequestURL();
        String detailMessage = exception.getLocalizedMessage();
        int code = 2;

        ErrorResponse response = new ErrorResponse(
                status.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, status);
    }

    // Not support HTTP Method
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = getMessageFromHttpRequestMethodNotSupportedException(exception);
        String detailMessage = exception.getLocalizedMessage();
        int code = 3;

        ErrorResponse response = new ErrorResponse(
                status.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, status);
    }

    private String getMessageFromHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException exception) {
        StringBuilder message = new StringBuilder(exception.getMethod() + " method is not supported. Supported methods are ");
        exception.getSupportedHttpMethods().forEach(method -> message.append(" ").append(method));
        return message.toString();
    }

    // Not support media type
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = getMessageFromHttpMediaTypeNotSupportedException(exception);
        String detailMessage = exception.getLocalizedMessage();
        int code = 4;

        ErrorResponse response = new ErrorResponse(
                status.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, status);
    }

    private String getMessageFromHttpMediaTypeNotSupportedException(
            HttpMediaTypeNotSupportedException exception) {
        StringBuilder message = new StringBuilder(exception.getContentType() + " media type is not supported. Supported media types are ");
        exception.getSupportedMediaTypes().forEach(mediaType -> message.append(mediaType).append(", "));
        return message.substring(0, message.length() - 2);
    }

    // Missing parameter
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = exception.getParameterName() + " parameter is missing";
        String detailMessage = exception.getLocalizedMessage();
        int code = 5;

        ErrorResponse response = new ErrorResponse(
                status.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, status);
    }

    // Wrong parameter type
    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException exception) {

        String message = exception.getName() + " should be of type " + exception.getRequiredType().getName();
        String detailMessage = exception.getLocalizedMessage();
        int code = 6;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                message,
                detailMessage,
                code,
                new Exception(),
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Bean validation
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String message = "Validation error in parameters!";
        String detailMessage = exception.getLocalizedMessage();
        Map<String, String> errors = new HashMap<>();
        for (ObjectError error : exception.getBindingResult().getAllErrors()) {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        }
        int code = 7;

        ErrorResponse response = new ErrorResponse(
                status.value(),
                message,
                detailMessage,
                code,
                errors,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, status);
    }

    // Bean validation
    @SuppressWarnings("rawtypes")
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(
            ConstraintViolationException exception) {
        String message = "Validation error in parameters!";
        String detailMessage = exception.getLocalizedMessage();
        Map<String, String> errors = new HashMap<>();
        for (ConstraintViolation violation : exception.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        }
        int code = 8;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                message,
                detailMessage,
                code,
                errors,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 401 Unauthorized
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsException(
            BadCredentialsException exception) {
        String message = "Authentication Failed";
        String detailMessage = exception.getLocalizedMessage();
        int code = 9;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(PageException.class)
    public ResponseEntity<Object> handleInvalidPaginationParameterException(PageException exception) {
        String message = "Invalid pagination parameters!";
        String detailMessage = exception.getLocalizedMessage();
        int code = 10;  // Mã lỗi tùy chỉnh cho ngoại lệ phân trang

        // Tạo đối tượng ErrorResponse để trả về cho client
        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        // Log lỗi chi tiết
        log.error(detailMessage, exception);

        // Trả về phản hồi với mã lỗi 400 (Bad Request)
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleEntityNotFoundException(EntityNotFoundException exception) {
        String message = "Entity not found!";
        String detailMessage = exception.getLocalizedMessage();
        int code = 11; // Mã lỗi cho "Not Found"

        // Tạo đối tượng ErrorResponse để trả về thông tin lỗi
        ErrorResponse response = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        // Log lỗi chi tiết
        log.error(detailMessage, exception);

        // Trả về phản hồi với mã lỗi 404 (Not Found)
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    //Lỗi định dạng đầu vào không hợp lệ (InvalidFormatException)
    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<Object> handleInvalidFormatException(InvalidFormatException exception) {
        String message = "Invalid format for field " + exception.getPathReference();
        String detailMessage = exception.getLocalizedMessage();
        int code = 12;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    //Lỗi truy cập bị từ chối tài nguyên (Access Denied)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException exception) {
        String message = "Access Denied";
        String detailMessage = exception.getLocalizedMessage();
        int code = 13;

        ErrorResponse response = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                message,
                detailMessage,
                code,
                exception,
                null,
                null
        );

        log.error(detailMessage, exception);

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }


//    // Account blocked exception
//    @ExceptionHandler({ AccountBlockException.class })
//    public ResponseEntity<Object> handleAccountBlockException(AccountBlockException exception) {
//        String detailMessage = exception.getLocalizedMessage();
//        int code = 11;
//
//        ErrorResponse response = new ErrorResponse(
//                HttpStatus.FORBIDDEN.value(),
//                detailMessage,
//                detailMessage,
//                code,
//                exception,
//                null,
//                null
//        );
//
//        log.error(detailMessage, exception);
//
//        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
//    }
}
