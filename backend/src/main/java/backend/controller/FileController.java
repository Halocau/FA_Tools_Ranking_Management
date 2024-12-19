package backend.controller;

import backend.config.exception.exceptionEntity.StorageException;
import backend.model.dto.FileResponse;
import backend.service.IFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
//download
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;

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
        List<String> allowedExtensions = Arrays.asList("xlsx");
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

    @GetMapping("/files")
    public ResponseEntity<Resource> download(
            @RequestParam(name = "fileName", required = false) String fileName,
            @RequestParam(name = "folder", required = false) String folder)
            throws StorageException, URISyntaxException, FileNotFoundException {
        if (fileName == null || folder == null) {
            throw new StorageException("Missing required params : (fileName or folder) in query params.");
        }

        // check file exist (and not a directory)
        long fileLength = this.iFileService.getFileLength(fileName, folder);
        if (fileLength == 0) {
            throw new StorageException("File with name = " + fileName + " not found.");
        }

        // download a file
        InputStreamResource resource = this.iFileService.getResource(fileName, folder);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentLength(fileLength)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
