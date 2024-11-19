package backend.dao;

import backend.model.entity.RankingTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingTitleRepository extends JpaRepository<RankingTitle, Integer> , JpaSpecificationExecutor<RankingTitle> {
}
