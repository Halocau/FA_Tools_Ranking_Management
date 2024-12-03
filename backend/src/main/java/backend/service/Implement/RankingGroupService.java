package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.config.exception.exceptionEntity.RankingGroupException;
import backend.dao.IAccount;
import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupRepository;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.Account;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
import backend.model.form.RankingGroup.UpdateNewGroupRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IRankingGroupService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RankingGroupService implements IRankingGroupService {

    private IRankingGroupRepository iRankingGroupRepository;
    private IAccount iAccount;
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingGroupService(IRankingGroupRepository iRankingGroupRepository, IAccount iAccount,
                               IRankingDecisionRepository iRankingDecisionRepository, ModelMapper modelMapper) {
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iAccount = iAccount;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResultPaginationDTO getAllRankingGroups(Specification<RankingGroup> spec, Pageable pageable) {
        Page<RankingGroup> rankingGroups = iRankingGroupRepository.findAll(spec, pageable);

        // Kiểm tra nếu không có nhóm nào (Check if no groups are found)
        if (rankingGroups.isEmpty()) {
            throw new RankingGroupException("No Ranking Groups found.");
        }

        // Cập nhật thông tin username và decisionName cho từng nhóm (Update username and decisionName for each group)
        for (RankingGroup group : rankingGroups) {
            // Lấy tài khoản bằng ID (Fetch account by ID)
            Account account = iAccount.findById(group.getCreatedBy())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            group.setUsername(account.getUsername());

            // Cập nhật tên quyết định (Update decision name)
            if (group.getCurrent_ranking_decision() != null) {
                RankingDecision decision = iRankingDecisionRepository.findByDecisionId(group.getCurrent_ranking_decision());
                group.setDecisionName(decision != null ? decision.getDecisionName() : null);
            } else {
                group.setDecisionName(null);
            }
        }

        // Trả về dữ liệu phân trang (Return paginated result)
        return new PaginationUtils().buildPaginationDTO(rankingGroups);
    }

    @Override
    public RankingGroup findRankingGroupById(int id) {
        // Tìm nhóm xếp hạng bằng ID hoặc báo lỗi nếu không tìm thấy (Find group by ID or throw error if not found)
        RankingGroup group = iRankingGroupRepository
                .findById(id)
                .orElseThrow(() -> new RankingGroupException("RankingGroup not found with id: " + id));

        // Cập nhật username (Update username)
        iAccount.findById(group.getCreatedBy())
                .ifPresent(account -> group.setUsername(account.getUsername()));

        // Cập nhật decisionName (Update decisionName)
        if (group.getCurrent_ranking_decision() != null) {
            RankingDecision decision = iRankingDecisionRepository.findByDecisionId(group.getCurrent_ranking_decision());
            group.setDecisionName(decision != null ? decision.getDecisionName() : null);
        } else {
            group.setDecisionName(null);
        }
        return group;
    }

    @Override
    @Transactional
    public RankingGroup addRankingGroup(RankingGroup rankingGroup) {
        rankingGroup.setGroupId(0); // Đặt ID về 0 để tạo mới (Set ID to 0 to create a new group)

        // Lưu nhóm và cập nhật thông tin (Save group and update details)
        RankingGroup createdGroup = iRankingGroupRepository.save(rankingGroup);

        // Cập nhật username nếu tìm thấy tài khoản (Update username if account is found)
        Optional<Account> optionalAccount = iAccount.findById(createdGroup.getCreatedBy());
        optionalAccount.ifPresent(account -> createdGroup.setUsername(account.getUsername()));

        // Kiểm tra và cập nhật tên quyết định (Check and update decision name)
        RankingDecision decision = iRankingDecisionRepository.findByDecisionId(rankingGroup.getCurrent_ranking_decision());
        if (decision != null) {
            createdGroup.setDecisionName(decision.getDecisionName());
        } else {
            throw new RuntimeException("Ranking Decision not found");
        }
        return createdGroup;
    }

    @Override
    @Transactional
    public RankingGroup editRankingGroup(RankingGroup rankingGroup) {
        // Cập nhật nhóm và lưu lại (Update and save group)
        return iRankingGroupRepository.saveAndFlush(rankingGroup);
    }

    @Override
    public void deleteRankingGroup(int id) {
        // Xóa nhóm xếp hạng bằng ID (Delete group by ID)
        iRankingGroupRepository.deleteById(id);
    }

    /// Response
    @Override
    public List<RankingGroupResponse> getAllRankingGroupResponses(List<RankingGroup> rankingGroups) {
        List<RankingGroupResponse> responseList = new ArrayList<>();
        for (RankingGroup rankingGroup : rankingGroups) {
            // Ánh xạ từ RankingGroup sang RankingGroupResponse (Map RankingGroup to RankingGroupResponse)
            RankingGroupResponse response = modelMapper.map(rankingGroup, RankingGroupResponse.class);

            if (rankingGroup.getCurrent_ranking_decision() == null) {
                response.setCurrentRankingDecision(null);
            } else {
                // Lấy tên quyết định và thiết lập vào response (Fetch decision name and set it in the response)
                RankingDecision decision = iRankingDecisionRepository.findByDecisionId(rankingGroup.getCurrent_ranking_decision());
                response.setCurrentRankingDecision(decision != null ? decision.getDecisionName() : null);
                response.setDecisionId(decision != null ? decision.getDecisionId() : null);
            }
            responseList.add(response);
        }
        return responseList;
    }

    @Override
    public RankingGroupResponse getRankingGroupResponseById(RankingGroup rankingGroup) {
        // Ánh xạ dữ liệu từ entity sang DTO (Map data from entity to DTO)
        RankingGroupResponse response = modelMapper.map(rankingGroup, RankingGroupResponse.class);
        response.setCurrentRankingDecision(rankingGroup.getDecisionName());
        response.setDecisionId(rankingGroup.getCurrent_ranking_decision());

        // Lấy và thiết lập tên người tạo (Fetch and set creator's name)
        iAccount.findById(rankingGroup.getCreatedBy())
                .ifPresent(account -> response.setCreatedBy(account.getFullName()));
        return response;
    }

    /// Form
    @Override
    @Transactional
    public void createRankingGroup(AddNewGroupRequest form) {
        // Tạo nhóm mới dựa trên form đầu vào (Create new group based on input form)
        RankingGroup rankingGroup = RankingGroup.builder()
                .groupName(form.getGroupName())
                .createdBy(form.getCreatedBy())
                .build();
        iRankingGroupRepository.save(rankingGroup);
    }

    @Override
    @Transactional
    public void updateRankingGroup(Integer groupId, UpdateNewGroupRequest form) {
        // Tìm và cập nhật nhóm xếp hạng (Find and update ranking group)
        RankingGroup group = iRankingGroupRepository.findById(groupId)
                .orElseThrow(() -> new RankingGroupException("Ranking Group not found id: " + groupId));

        // Kiểm tra tên nhóm đã tồn tại chưa (Check if group name already exists)
        if (!group.getGroupName().equals(form.getGroupName()) &&
                iRankingGroupRepository.existsByGroupNameAndGroupIdNot(form.getGroupName(), groupId)) {
            throw new IllegalArgumentException("Group name already exists.");
        }

        group.setGroupName(form.getGroupName());
        if (form.getCurrentRankingDecision() != null) {
            group.setCurrent_ranking_decision(form.getCurrentRankingDecision());
        }
        iRankingGroupRepository.saveAndFlush(group);
    }

    /// Validate
    @Override
    public boolean isRankingGroupExitsByGroupName(String groupName) {
        // Kiểm tra sự tồn tại của nhóm theo tên (Check for group existence by name)
        return iRankingGroupRepository.existsByGroupName(groupName);
    }
}


