package backend.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ResponseError {
    private int status;
    private String message;
    private String timestamp;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    public ResponseError(int status, String message) {
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now().format(formatter);
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
