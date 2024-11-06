package backend.dao;

import backend.model.entity.Options;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface IOptionRepository extends JpaRepository<Options, Integer> {
    public List<Options> findByCriteriaId(Integer criteriaId);
    boolean existsByOptionName(String optionName);
}
