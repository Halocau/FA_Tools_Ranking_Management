package backend.dao;

import backend.model.entity.Criteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ICriteriaRepository extends JpaRepository<Criteria, Integer>, JpaSpecificationExecutor<Criteria> {
    public Criteria findByCriteriaId(int criteriaId);
}
