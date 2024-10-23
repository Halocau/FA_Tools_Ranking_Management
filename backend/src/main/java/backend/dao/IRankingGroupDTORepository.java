package backend.dao;


import backend.model.dto.RankingGroupDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRankingGroupDTORepository extends JpaRepository<RankingGroupDTO, Integer> {
}
