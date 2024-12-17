package backend.dao;

import backend.model.entity.RankingGroup;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingGroupRepository extends JpaRepository<RankingGroup, Integer>, JpaSpecificationExecutor<RankingGroup> {
    boolean existsByGroupName(String groupName);// check group name

    boolean existsByGroupNameAndGroupIdNot(String groupName, Integer groupId);
    List<RankingGroup> findByGroupNameContainingIgnoreCase(String groupName, Pageable pageable);
}
