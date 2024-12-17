package backend.dao;

import backend.model.entity.Criteria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ICriteriaRepository extends JpaRepository<Criteria, Integer>, JpaSpecificationExecutor<Criteria> {
    boolean existsByCriteriaName(String name);

    boolean existsByCriteriaNameAndCriteriaIdNot(@NotBlank @Size(min = 3, max = 100) String criteriaName, int criteriaId);
}
