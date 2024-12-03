package backend.dao;

import backend.model.entity.RankingTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRankingTitleRepository extends JpaRepository<RankingTitle, Integer> , JpaSpecificationExecutor<RankingTitle> {
    public List<RankingTitle> findByDecisionId(Integer decisionId);
    List<RankingTitle> findByDecisionIdOrderByTotalScoreAsc(Integer decisionId);
}
