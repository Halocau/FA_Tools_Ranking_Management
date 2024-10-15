package backend.backend.service;

import FA_tools.studentCrudAPI.model.Student;

import java.util.List;

public interface IStudentService {
    public List<Student> getALlStudent();
    public List<Student> findByFirstName(String firstName);
    public List<Student> findByFirstNameAndLastName(String firstName,String lastName);
    public List<Student> findByFirstNameIsNot(String firstName);
    public Student getStudentById(int id);
    public Student addStudent(Student student);
    public Student updateStudent(Student student);
    public void deleteStudentById(int id);

}
