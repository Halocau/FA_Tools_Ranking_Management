package backend.service;

import backend.model.dto.BulkRankingHistoryResponse;
import backend.model.entity.BulkRankingHistory;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface IBulkRankingHistoryService {
    public ResultPaginationDTO getAllBulkRankingHistory(Specification<BulkRankingHistory> spec, Pageable pageable);
    public BulkRankingHistory findBulkRankingHistoryById(int id);
    public BulkRankingHistory addBulkRankingHistory(BulkRankingHistory bulkRankingHistory);
    public BulkRankingHistory updateBulkRankingHistory(BulkRankingHistory bulkRankingHistory);
    public void deleteBulkRankingHistory(int id);

    //response
    public List<BulkRankingHistoryResponse> getAllBulkRankingHistoryResponses(List<BulkRankingHistory> list);
//    public List<BulkRankingHistoryResponse> findListBulkRankingHistoryResponses(Integer historyId);

}
