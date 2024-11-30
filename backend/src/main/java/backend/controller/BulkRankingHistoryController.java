package backend.controller;

import backend.model.dto.BulkRankingHistoryResponse;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.BulkRankingHistory;
import backend.model.form.BulkRankingHistory.CreateBulkRankingHistoryRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IBulkRankingHistoryService;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        ResultPaginationDTO dto = iBulkRankingHistoryService.getAllBulkRankingHistory(spec, pageable);

        List<BulkRankingHistory> bulkRankingHistoryList = (List<BulkRankingHistory>) dto.getResult();
        List<BulkRankingHistoryResponse> responseList = iBulkRankingHistoryService.getAllBulkRankingHistoryResponses(bulkRankingHistoryList);

        dto.setResult(responseList);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    @PostMapping("/add")
    public ResponseEntity<BulkRankingHistory> createBulkRankingHistory(@Valid @RequestBody CreateBulkRankingHistoryRequest form) {
        BulkRankingHistory createBulkRankingHistory =iBulkRankingHistoryService.createBulkRankingHistoryRequest(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(createBulkRankingHistory);
    }
}
