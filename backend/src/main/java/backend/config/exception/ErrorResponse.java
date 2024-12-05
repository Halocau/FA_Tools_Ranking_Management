package backend.config.exception;

import lombok.NonNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ErrorResponse {
    private int status;
    @NonNull
    private String message;
    @NonNull
    private String detailMessage;
    @NonNull
    private Integer code;
    @NonNull
    private Object exception;
    private String timestamp;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");


    public ErrorResponse(int status, @NonNull String message, @NonNull String detailMessage, @NonNull Integer code, @NonNull Object exception, String timestamp) {
        this.status = status;
        this.message = message;
        this.detailMessage = detailMessage;
        this.code = code;
        this.exception = exception;
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public @NonNull String getMessage() {
        return message;
    }

    public void setMessage(@NonNull String message) {
        this.message = message;
    }

    public @NonNull String getDetailMessage() {
        return detailMessage;
    }

    public void setDetailMessage(@NonNull String detailMessage) {
        this.detailMessage = detailMessage;
    }

    public @NonNull Integer getCode() {
        return code;
    }

    public void setCode(@NonNull Integer code) {
        this.code = code;
    }

    public @NonNull Object getException() {
        return exception;
    }

    public void setException(@NonNull Object exception) {
        this.exception = exception;
    }


    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
