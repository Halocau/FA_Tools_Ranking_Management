package backend.model.dto;

import lombok.*;

import java.time.Instant;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
    private String fileName;
    private Instant uploadAt;
}
