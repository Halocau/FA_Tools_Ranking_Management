package backend.model.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class AccountInfoDTO {
    private int id;
    private String username;
    private String email;
    private String role;
    private String status;
    private String fullName;
    private Date dateOfBirth;
    private String address;
    private String phoneNumber;
    private String gender;
}
