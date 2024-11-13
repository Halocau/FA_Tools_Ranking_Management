package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.IAccount;
import backend.dao.IBulkRankingHistoryRepository;
import backend.dao.IRankingDecisionRepository;
import backend.model.dto.BulkRankingHistoryResponse;
import backend.model.entity.Account;
import backend.model.entity.BulkRankingHistory;
import backend.model.entity.RankingDecision;
import backend.model.page.ResultPaginationDTO;
import backend.service.IBulkRankingHistoryService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BulkRankingHistoryService implements IBulkRankingHistoryService {
    private IBulkRankingHistoryRepository iBulkRankingHistoryRepository;
    private ModelMapper modelMapper;
    private IAccount iAccount;
    private IRankingDecisionRepository iRankingDecisionRepository;

    @Autowired
    public BulkRankingHistoryService(IBulkRankingHistoryRepository iBulkRankingHistoryRepository, ModelMapper modelMapper, IAccount iAccount, IRankingDecisionRepository iRankingDecisionRepository) {
        this.iBulkRankingHistoryRepository = iBulkRankingHistoryRepository;
        this.modelMapper = modelMapper;
        this.iAccount = iAccount;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
    }

    @Override
    public ResultPaginationDTO getAllBulkRankingHistory(Specification<BulkRankingHistory> spec, Pageable pageable) {
        Page<BulkRankingHistory> pageBulkRankingHistory = iBulkRankingHistoryRepository.findAll(spec, pageable);
        return new PaginationUtils().buildPaginationDTO(pageBulkRankingHistory);
    }

    @Override
    public BulkRankingHistory findBulkRankingHistoryById(int id) {
        return iBulkRankingHistoryRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public BulkRankingHistory addBulkRankingHistory(BulkRankingHistory bulkRankingHistory) {
        return iBulkRankingHistoryRepository.save(bulkRankingHistory);
    }

    @Override
    @Transactional
    public BulkRankingHistory updateBulkRankingHistory(BulkRankingHistory bulkRankingHistory) {
        return iBulkRankingHistoryRepository.saveAndFlush(bulkRankingHistory);
    }

    @Override
    @Transactional
    public void deleteBulkRankingHistory(int id) {
        iBulkRankingHistoryRepository.deleteById(id);
    }

    @Override
    public List<BulkRankingHistoryResponse> getAllBulkRankingHistoryResponses(List<BulkRankingHistory> list) {
        List<BulkRankingHistoryResponse> responseList = new ArrayList<>();
        for (BulkRankingHistory bulkRankingHistory : list) {
            //change
            BulkRankingHistoryResponse response = modelMapper.map(bulkRankingHistory, BulkRankingHistoryResponse.class);

            //handle decisionName
            if (bulkRankingHistory.getDecisionId() == null) {
                response.setDecisionName(null);
            } else {
                RankingDecision decision = iRankingDecisionRepository.findById(bulkRankingHistory.getDecisionId()).orElse(null);
                response.setDecisionName(decision != null ? decision.getDecisionName() : null);
            }

            //handle uploadByName
            if (bulkRankingHistory.getUploadBy() == null) {
                response.setUploadByName(null);
            } else {
                Account account = iAccount.findById(bulkRankingHistory.getUploadBy()).orElse(null);
                response.setUploadByName(account != null ? account.getUsername() : null);
            }
            responseList.add(response);
        }
        return responseList;
    }
}
