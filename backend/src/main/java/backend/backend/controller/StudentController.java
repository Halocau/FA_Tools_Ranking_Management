package backend.backend.controller;

import FA_tools.studentCrudAPI.model.Student;
import FA_tools.studentCrudAPI.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private IStudentService iStudentService;

    @Autowired
    public StudentController(IStudentService iStudentService) {
        this.iStudentService = iStudentService;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return iStudentService.getALlStudent();
    }

    @GetMapping("/first-name/{name}")
    public List<Student> getFirstName(@PathVariable String name) {
        return iStudentService.findByFirstName(name);
    }

    @GetMapping("/first-name-not/{name}")
    public List<Student> getFirstNameIsNot(@PathVariable String name) {
        return iStudentService.findByFirstNameIsNot(name);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable int id) {
        Student student = iStudentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(student);
        }
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        student.setId(0);
        student = iStudentService.addStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@RequestBody Student student, @PathVariable int id) {
        Student exits = iStudentService.getStudentById(id);
        if (exits == null) {
            return ResponseEntity.notFound().build();
        } else {
            exits.setEmail(student.getEmail());
            exits.setFirstName(student.getFirstName());
            exits.setLastName(student.getLastName());
            iStudentService.updateStudent(student);
            return ResponseEntity.ok(exits);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable int id) {
        Student student = iStudentService.getStudentById(id);
        if (student == null) {
            return ResponseEntity.notFound().build();
        } else {
            iStudentService.deleteStudentById(id);
            return ResponseEntity.ok().build();
        }
    }
}
