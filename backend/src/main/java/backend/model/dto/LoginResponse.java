package backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class LoginResponse {
    private int id;
    private String email;
    private String role;
    private String fullName;
    private String token;
}
