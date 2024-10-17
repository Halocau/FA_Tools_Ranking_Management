package backend.backend.dao;

import backend.backend.model.RankingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.Path;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(path = "ranking-group")
public interface RankingGroupRepository extends JpaRepository<RankingGroup, Integer> {
}
