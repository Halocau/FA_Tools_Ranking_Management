package backend.dao;

import backend.model.entity.RankingTitleOption;
import backend.model.entity.Serializable.RankingTitleOptionSerializable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRankingTitleOptionRepository
        extends JpaRepository<RankingTitleOption, RankingTitleOptionSerializable> {

    RankingTitleOption findByRankingTitleIdAndOptionId(Integer rankingTitleId, Integer optionId);

    List<RankingTitleOption> findByRankingTitleId(Integer rankingTitleId);
}
