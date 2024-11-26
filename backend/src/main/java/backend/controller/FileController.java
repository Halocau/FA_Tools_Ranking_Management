package backend.controller;

import backend.config.exception.exceptionEntity.StorageException;
import backend.model.dto.FileResponse;
import backend.service.IFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/storage")
//use json pathvariable
//use form-data use requestparam
public class FileController {
    private IFileService iFileService;

    @Value("${backend.upload-file.base-uri}")
    private String baseURI;//value environment

    @Autowired
    public FileController(IFileService iFileService) {
        this.iFileService = iFileService;
    }

    @PostMapping("/files")
    public ResponseEntity<FileResponse> upload(
            @RequestParam(name = "file") MultipartFile file,
            @RequestParam(name = "folder") String folder
    ) throws URISyntaxException, IOException, StorageException {
        //validate
        if (file.isEmpty()) {
            throw new StorageException("File is empty. Please upload a file.");
        }
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx", "xlsx");
        boolean isValidExtension = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));
        if (!isValidExtension) {
            throw new StorageException("Invalid file extension. Only allows "+allowedExtensions.toString());
        }
        //create a directory if not exist
        this.iFileService.createDirectory(baseURI + folder);
        //store file
        String uploadFile = this.iFileService.store(file, folder);
        //response
        FileResponse res = new FileResponse(uploadFile, Instant.now());
        return ResponseEntity.ok().body(res);
    }
}
