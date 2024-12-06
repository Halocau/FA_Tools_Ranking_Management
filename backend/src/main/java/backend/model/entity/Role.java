package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "Role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;

    @Column(name = "name")
    private String roleName;

//    @OneToMany(mappedBy = "role")  // mappedBy chỉ ra rằng quan hệ này được quản lý bởi thuộc tính 'role' trong lớp Account
//    private List<Account> accounts;
}
