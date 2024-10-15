package backend.backend.service;

import FA_tools.studentCrudAPI.dao.IStudentRepository;
import FA_tools.studentCrudAPI.model.Student;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class StudentService implements IStudentService {
    private IStudentRepository iStudentRepository;

    @Autowired
    public StudentService(IStudentRepository iStudentRepository) {
        this.iStudentRepository = iStudentRepository;
    }

    @Override
    public List<Student> getALlStudent() {
        return iStudentRepository.findAll();
    }

    @Override
    public List<Student> findByFirstName(String firstName) {
        return iStudentRepository.findByFirstName(firstName);
    }

    @Override
    public List<Student> findByFirstNameAndLastName(String firstName, String lastName) {
        return iStudentRepository.findByFirstNameAndLastName(firstName, lastName);
    }

    @Override
    public List<Student> findByFirstNameIsNot(String firstName) {
        return iStudentRepository.findByFirstNameIsNot(firstName);
    }

    @Override
    public Student getStudentById(int id) {
        return iStudentRepository.findById(id).get();
    }

    @Override
    @Transactional
    public Student addStudent(Student student) {
        return iStudentRepository.save(student);
    }

    @Override
    @Transactional
    public Student updateStudent(Student student) {
        return iStudentRepository.saveAndFlush(student);
    }

    @Override
    @Transactional
    public void deleteStudentById(int id) {
        iStudentRepository.deleteById(id);
    }
}
