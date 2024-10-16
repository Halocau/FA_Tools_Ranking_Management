package backend.backend.dao;

import backend.backend.model.RankingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RankingGroupRepository extends JpaRepository<RankingGroup, Integer> {
}
