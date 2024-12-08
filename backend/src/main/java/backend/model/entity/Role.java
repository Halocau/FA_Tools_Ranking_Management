package backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "Role")
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specifies auto-increment for the primary key
    @Column(name = "role_id") // Maps to the `role_id` column
    private Integer roleId;

    @Column(name = "name", nullable = false, length = 255) // Maps to the `name` column
    private String name;
}
