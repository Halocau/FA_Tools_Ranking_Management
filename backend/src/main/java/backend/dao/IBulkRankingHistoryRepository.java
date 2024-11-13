package backend.dao;

import backend.model.entity.BulkRankingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IBulkRankingHistoryRepository extends JpaRepository<BulkRankingHistory, Integer>, JpaSpecificationExecutor<BulkRankingHistory> {
}
