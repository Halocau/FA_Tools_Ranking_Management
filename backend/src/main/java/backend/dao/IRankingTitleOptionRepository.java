package backend.dao;

import backend.model.entity.RankingTitleOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingTitleOptionRepository extends JpaRepository<RankingTitleOption, Integer> {
}
