package backend.dao;

import backend.model.entity.RankingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingGroupRepository extends JpaRepository<RankingGroup, Integer>, JpaSpecificationExecutor<RankingGroup> {
    boolean existsByGroupName(String groupName);// check group name
    boolean existsByGroupNameAndGroupIdNot(String groupName, Integer groupId);
}
