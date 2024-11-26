package backend.controller;

import backend.service.IFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

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
    public String upload(
            @RequestParam(name = "file") MultipartFile file,
            @RequestParam(name = "folder") String folder
    ) throws URISyntaxException, IOException {
        //skip validate

        //create a directory if not exist
        this.iFileService.createDirectory(baseURI + folder);
        //store file
        this.iFileService.store(file,folder);
        // return name file upload
        return file.getOriginalFilename() + folder;

    }
}
