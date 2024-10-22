package backend.service.Implement;

import backend.dao.IAccount;
import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupRepository;
import backend.model.Account;
import backend.model.RankingDecision;
import backend.model.RankingGroup;
import backend.service.IRankingGroupService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class RankingGroupService implements IRankingGroupService {
    private IRankingGroupRepository iRankingGroupRepository;
    private IAccount iAccount;
    private IRankingDecisionRepository iRankingDecisionRepository;

    @Autowired
    public RankingGroupService(IRankingGroupRepository iRankingGroupRepository, IAccount iAccount, IRankingDecisionRepository iRankingDecisionRepository) {
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iAccount = iAccount;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
    }

    //    @Override
//    public List<RankingGroup> getAllRankingGroups() {
//        return iRankingGroupRepository.findAll();
//    }
    @Override
    public List<RankingGroup> getAllRankingGroups() {
        List<RankingGroup> rankingGroups = iRankingGroupRepository.findAll();

        // Kiểm tra nếu không có nhóm nào
        if (rankingGroups.isEmpty()) {
            throw new ResourceNotFoundException("No Ranking Groups found.");
        }

        for (RankingGroup group : rankingGroups) {
            // Lấy thông tin tài khoản từ ID
            Optional<Account> optionalAccount = iAccount.findById(group.getCreatedBy());
            if (optionalAccount.isPresent()) {
                Account account = optionalAccount.get(); // Lấy tài khoản
                group.setUsername(account.getUsername()); // Thiết lập username
            }

            // Lấy thông tin RankingDecision theo group_id
            Optional<RankingDecision> optionalRankingDecision = Optional.ofNullable(iRankingDecisionRepository.findByGroupId(group.getGroupId()));
            if (optionalRankingDecision.isPresent()) {
                RankingDecision decision = optionalRankingDecision.get();
                group.setDecisionName(decision.getDecisionName()); // Thiết lập decisionName
            }
        }

        return rankingGroups;
    }


    @Override
    public RankingGroup findRankingGroupById(int id) {
        // Lấy nhóm xếp hạng hoặc ném ngoại lệ nếu không tìm thấy
        RankingGroup group = iRankingGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RankingGroup not found with id: " + id));

        // Lấy tài khoản được tạo bởi 'CreatedBy' của nhóm, nếu có, thiết lập username
        iAccount.findById(group.getCreatedBy())
                .ifPresent(account -> group.setUsername(account.getUsername()));

        // Lấy quyết định xếp hạng dựa trên groupId, nếu có, thiết lập decisionName
        RankingDecision decision = iRankingDecisionRepository.findByGroupId(group.getGroupId());
        if (decision != null) {
            group.setDecisionName(decision.getDecisionName());
        } else {
            throw new ResourceNotFoundException("RankingDecision not found for groupId: " + group.getGroupId());
        }

        return group;
    }


    @Override
    @Transactional
    public RankingGroup addRankingGroup(RankingGroup rankingGroup) {
        rankingGroup.setGroupId(0); // Đặt ID về 0 để tạo ới
        RankingGroup createdGroup = iRankingGroupRepository.save(rankingGroup); // Lưu nhóm xếp hạng

        // Lấy thông tin tài khoản từ ID và thiết lập username
        Optional<Account> optionalAccount = iAccount.findById(createdGroup.getCreatedBy());
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get(); // Lấy tài khoản
            createdGroup.setUsername(account.getUsername()); // Thiết lập username
        }
        Optional<RankingDecision> optionalRankingDecision = Optional.ofNullable(iRankingDecisionRepository.findByGroupId(createdGroup.getGroupId()));
        if (optionalRankingDecision.isPresent()) {
            RankingDecision decision = optionalRankingDecision.get();
            createdGroup.setDecisionName(decision.getDecisionName()); // Thiết lập decisionName
        }

        return createdGroup; // Trả về nhóm xếp hạng đã tạo
    }

    @Override
    @Transactional
    public RankingGroup updateRankingGroup(RankingGroup rankingGroup) {
        return iRankingGroupRepository.saveAndFlush(rankingGroup);
    }

    @Override
    @Transactional
    public void deleteRankingGroup(RankingGroup rankingGroup) {
        iRankingGroupRepository.delete(rankingGroup);
    }
}
