package backend.controller;

import backend.model.dto.BulkRankingHistoryResponse;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.BulkRankingHistory;
import backend.model.page.ResultPaginationDTO;
import backend.service.IBulkRankingHistoryService;
import com.turkraft.springfilter.boot.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/bulk-ranking-history")
public class BulkRankingHistoryController {
    private IBulkRankingHistoryService iBulkRankingHistoryService;

    @Autowired
    public BulkRankingHistoryController(IBulkRankingHistoryService iBulkRankingHistoryService) {
        this.iBulkRankingHistoryService = iBulkRankingHistoryService;
    }

    @GetMapping
    public ResponseEntity<ResultPaginationDTO> getAllBulkRankingHistory(
            @Filter Specification<BulkRankingHistory> spec,
            Pageable pageable
            ) {
        ResultPaginationDTO dto =iBulkRankingHistoryService.getAllBulkRankingHistory(spec, pageable);

        List<BulkRankingHistory> bulkRankingHistoryList = (List<BulkRankingHistory>) dto.getResult();
        List<BulkRankingHistoryResponse> responseList = iBulkRankingHistoryService.getAllBulkRankingHistoryResponses(bulkRankingHistoryList);

        dto.setResult(responseList);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }
//    @GetMapping("/get/{historyId}")
//    public ResponseEntity<List<BulkRankingHistoryResponse>> findListOfBulkRankingHistory(@PathVariable(name = "historyId") Integer historyId){
//        List<BulkRankingHistoryResponse> responseList = iBulkRankingHistoryService.findListBulkRankingHistoryResponses(historyId);
//        return ResponseEntity.status(HttpStatus.OK).body(responseList);
//
//    }
}
