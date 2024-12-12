package backend.dao;

import backend.model.entity.Options;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOptionRepository extends JpaRepository<Options, Integer>, JpaSpecificationExecutor<Options> {
    public List<Options> findByCriteriaId(Integer criteriaId);

    boolean existsByOptionName(String optionName);

    boolean existsByOptionNameAndOptionIdNot(String optionName, Integer optionId);

    boolean existsByScoreAndCriteriaId(@NotNull Integer score, @NotNull Integer criteriaId);

    boolean existsByScoreAndCriteriaIdAndOptionIdNot(@NotNull Integer score, @NotNull Integer criteriaId, Integer optionId);
}
