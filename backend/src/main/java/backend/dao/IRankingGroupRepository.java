package backend.dao;

import backend.model.entity.RankingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingGroupRepository extends JpaRepository<RankingGroup, Integer> {
    boolean existsByGroupName(String groupName);// check group name
}
