package backend.dao;

import backend.model.entity.RankingTitleOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingTitleOptionRepository extends JpaRepository<RankingTitleOption, Integer> {
    public RankingTitleOption findByRankingTitleIdAndOptionId(Integer rankingTitleId, Integer optionId);
}
