package backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class LoginResponse {
    @NotBlank
    private int id;
    @NotBlank
    private String email;
    @NotBlank
    private String role;
    @NotBlank
    private String status;
    @NotBlank
    private String fullName;
    @NotBlank
    private Date dateOfBirth;
    @NotBlank
    private String address;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String gender;
    @NotBlank
    private String token;
    @NotBlank
    private LocalDateTime tokenExpiration;
}
