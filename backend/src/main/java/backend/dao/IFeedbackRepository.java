package backend.dao;

import backend.model.entity.Feedback;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFeedbackRepository extends JpaRepository<Feedback,Integer> {
    Optional<Feedback> findByDecisionId(@NotNull Integer decisionId);
}
