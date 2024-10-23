package backend.service.Implement;


import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupDTORepository;
import backend.model.Account;
import backend.model.RankingDecision;
import backend.model.RankingGroup;
import backend.model.dto.RankingGroupDTO;
import backend.service.IRankingGroupDTOService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RankingGroupDTOService implements IRankingGroupDTOService {
    private IRankingGroupDTORepository iRankingGroupDTORepository;
    private IRankingDecisionRepository iRankingDecisionRepository;

    @Autowired
    public RankingGroupDTOService(IRankingGroupDTORepository iRankingGroupDTORepository, IRankingDecisionRepository iRankingDecisionRepository) {
        this.iRankingGroupDTORepository = iRankingGroupDTORepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
    }

    public RankingGroupDTOService(IRankingGroupDTORepository iRankingGroupDTORepository) {
        this.iRankingGroupDTORepository = iRankingGroupDTORepository;
    }

    @Override
    public List<RankingGroupDTO> getAllRankingGroups() {
        List<RankingGroupDTO> rankingGroups = iRankingGroupDTORepository.findAll();

        // Kiểm tra nếu không có nhóm nào
        if (rankingGroups.isEmpty()) {
            throw new ResourceNotFoundException("No Ranking Groups found.");
        }

        for (RankingGroupDTO group : rankingGroups) {
            // Lấy thông tin RankingDecision theo group_id
            Optional<RankingDecision> optionalRankingDecision = Optional.ofNullable(iRankingDecisionRepository.findByGroupId(group.getGroupId()));
            if (optionalRankingDecision.isPresent()) {
                RankingDecision decision = optionalRankingDecision.get();
                group.setCurrrentRankingDecision(decision.getDecisionName()); // Thiết lập decisionName
            }
        }

        return rankingGroups;
    }

    @Override
    public RankingGroupDTO findRankingGroupById(int id) {
        // Lấy nhóm xếp hạng hoặc ném ngoại lệ nếu không tìm thấy
        RankingGroupDTO group = iRankingGroupDTORepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RankingGroup not found with id: " + id));

        // Lấy quyết định xếp hạng dựa trên groupId, nếu có, thiết lập decisionName
        RankingDecision decision = iRankingDecisionRepository.findByGroupId(group.getGroupId());
        if (decision != null) {
            group.setCurrrentRankingDecision(decision.getDecisionName());
        } else {
            throw new ResourceNotFoundException("RankingDecision not found for groupId: " + group.getGroupId());
        }
        return group;
    }

    @Override
    @Transactional
    public RankingGroupDTO addRankingGroup(RankingGroupDTO rankingGroupDTO) {
        rankingGroupDTO.setGroupId(0); // Đặt ID về 0 để tạo ới
        RankingGroupDTO createdGroup = iRankingGroupDTORepository.save(rankingGroupDTO); // Lưu nhóm xếp hạng

        Optional<RankingDecision> optionalRankingDecision = Optional.ofNullable(iRankingDecisionRepository.findByGroupId(createdGroup.getGroupId()));
        if (optionalRankingDecision.isPresent()) {
            RankingDecision decision = optionalRankingDecision.get();
            createdGroup.setCurrrentRankingDecision(decision.getDecisionName()); // Thiết lập decisionName
        }

        return createdGroup; // Trả về nhóm xếp hạng đã tạo
    }


    @Override
    @Transactional
    public RankingGroupDTO updateRankingGroup(RankingGroupDTO rankingGroupDTO) {
        return iRankingGroupDTORepository.saveAndFlush(rankingGroupDTO);
    }

    @Override
    @Transactional
    public void deleteRankingGroup(RankingGroupDTO rankingGroupDTO) {
        iRankingGroupDTORepository.delete(rankingGroupDTO);
    }
}
