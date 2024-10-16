package backend.backend.dao;


import backend.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
//@RepositoryRestResource(path = "students")
public interface IStudentRepository extends JpaRepository<Student, Integer> {
    //truy vấn bằng firstName
    public List<Student> findByFirstName(String firstName);

    //truy vấn bằng firstName và lastName
    public List<Student> findByFirstNameAndLastName(String firstName,String lastName);

    //Truy vấn các students có firstName khác với giá trị tìm kiếm
    public List<Student> findByFirstNameIsNot(String firstName);

    @Query("select s from Student s where s.firstName not like %:firstName%")
    public List<Student> findByFirstNameKhac(String firstName);
}
