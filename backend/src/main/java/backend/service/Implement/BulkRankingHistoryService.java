package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.IAccount;
import backend.dao.IBulkRankingHistoryRepository;
import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupRepository;
import backend.model.dto.BulkRankingHistoryResponse;
import backend.model.entity.Account;
import backend.model.entity.BulkRankingHistory;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.BulkRankingHistory.CreateBulkRankingHistoryRequest;
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
import java.util.Optional;

@Service
public class BulkRankingHistoryService implements IBulkRankingHistoryService {
    private IBulkRankingHistoryRepository iBulkRankingHistoryRepository;
    private ModelMapper modelMapper;
    private IAccount iAccount;
    private IRankingGroupRepository irankingGroupRepository;
    private IRankingDecisionRepository irankingDecisionRepository;

    @Autowired
    public BulkRankingHistoryService(IBulkRankingHistoryRepository iBulkRankingHistoryRepository, ModelMapper modelMapper, IAccount iAccount, IRankingGroupRepository irankingGroupRepository, IRankingDecisionRepository irankingDecisionRepository) {
        this.iBulkRankingHistoryRepository = iBulkRankingHistoryRepository;
        this.modelMapper = modelMapper;
        this.iAccount = iAccount;
        this.irankingGroupRepository = irankingGroupRepository;
        this.irankingDecisionRepository = irankingDecisionRepository;
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
            // Map BulkRankingHistory to BulkRankingHistoryResponse
            BulkRankingHistoryResponse response = modelMapper.map(bulkRankingHistory, BulkRankingHistoryResponse.class);

            // Handle decisionName
            if (bulkRankingHistory.getRankingGroupId() != null) {
                Optional<RankingGroup> optionalRankingGroup = irankingGroupRepository.findById(bulkRankingHistory.getRankingGroupId());
                if (optionalRankingGroup.isPresent()) {
                    RankingGroup rankingGroup = optionalRankingGroup.get();
                    RankingDecision rankingDecision = irankingDecisionRepository.findByDecisionId(rankingGroup.getCurrent_ranking_decision());
                    if (rankingDecision != null) {
                        response.setDecisionName(rankingDecision.getDecisionName());
                    } else {
                        response.setDecisionName(null);
                    }
                } else {
                    response.setDecisionName(null);
                }
            } else {
                response.setDecisionName(null);
            }

            // Handle uploadByName
            if (bulkRankingHistory.getUploadBy() != null) {
                Optional<Account> optionalAccount = iAccount.findById(bulkRankingHistory.getUploadBy());
                if (optionalAccount.isPresent()) {
                    response.setUploadByName(optionalAccount.get().getUsername());
                } else {
                    response.setUploadByName(null);
                }
            } else {
                response.setUploadByName(null);
            }

            // Add to the response list
            responseList.add(response);
        }

        return responseList;
    }

    @Override
    @Transactional
    public BulkRankingHistory createBulkRankingHistoryRequest(CreateBulkRankingHistoryRequest form) {
        BulkRankingHistory create = BulkRankingHistory.builder()
                .fileName(form.getFileName())
                .filePath(form.getFilePath())
                .rankingGroupId(form.getRankingGroupId())
                .uploadBy(form.getUploadBy())
                .status(form.getStatus())
                .note(form.getNote())
                .build();
        iBulkRankingHistoryRepository.save(create);
        return create;
    }


//    @Override
//    public List<BulkRankingHistoryResponse> findListBulkRankingHistoryResponses(Integer historyId) {
//        List<BulkRankingHistory> findByHistoryId = iBulkRankingHistoryRepository.findByHistoryId(historyId);
//        List<BulkRankingHistoryResponse> responseList = new ArrayList<>();
//        for (BulkRankingHistory bulkRankingHistory : findByHistoryId) {
//            BulkRankingHistoryResponse response = modelMapper.map(bulkRankingHistory, BulkRankingHistoryResponse.class);
//            // Handle decisionName
//            if (bulkRankingHistory.getRankingGroupId() != null) {
//                Optional<RankingGroup> optionalRankingGroup = irankingGroupRepository.findById(bulkRankingHistory.getRankingGroupId());
//                if (optionalRankingGroup.isPresent()) {
//                    RankingGroup rankingGroup = optionalRankingGroup.get();
//                    RankingDecision rankingDecision = irankingDecisionRepository.findByDecisionId(rankingGroup.getCurrent_ranking_decision());
//                    if (rankingDecision != null) {
//                        response.setDecisionName(rankingDecision.getDecisionName());
//                    } else {
//                        response.setDecisionName(null);
//                    }
//                } else {
//                    response.setDecisionName(null);
//                }
//            } else {
//                response.setDecisionName(null);
//            }
//
//            // Handle uploadByName
//            if (bulkRankingHistory.getUploadBy() != null) {
//                Optional<Account> optionalAccount = iAccount.findById(bulkRankingHistory.getUploadBy());
//                if (optionalAccount.isPresent()) {
//                    response.setUploadByName(optionalAccount.get().getUsername());
//                } else {
//                    response.setUploadByName(null);
//                }
//            } else {
//                response.setUploadByName(null);
//            }
//
//            // Add to the response list
//            responseList.add(response);
//        }
//        return responseList;
//    }
}
