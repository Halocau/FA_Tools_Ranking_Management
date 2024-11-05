package backend.service.Implement;

import backend.dao.IAccount;
import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupRepository;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.Account;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
import backend.model.form.RankingGroup.UpdateGroupInfo;
import backend.model.form.RankingGroup.UpdateNewGroupRequest;
import backend.service.IRankingGroupService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RankingGroupService extends BaseService implements IRankingGroupService {

    private IRankingGroupRepository iRankingGroupRepository;
    private IAccount iAccount;
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingGroupService(ModelMapper modelMapper, IRankingGroupRepository iRankingGroupRepository,
                               IAccount iAccount, IRankingDecisionRepository iRankingDecisionRepository, ModelMapper modelMapper1) {
        super(modelMapper);
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iAccount = iAccount;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper1;
    }

    @Override
    public List<RankingGroup> getAllRankingGroups() {
        List<RankingGroup> rankingGroups = iRankingGroupRepository.findAll();

        // Kiểm tra nếu không có nhóm nào
        if (rankingGroups.isEmpty()) {
            throw new ResourceNotFoundException("No Ranking Groups found.");
        }

        for (RankingGroup group : rankingGroups) {
            // take account via id
            Optional<Account> optionalAccount = iAccount.findById(group.getCreatedBy());
            if (optionalAccount.isPresent()) {
                Account account = optionalAccount.get(); // get account
                group.setUsername(account.getUsername()); // set username
            }
            RankingDecision decision = iRankingDecisionRepository.findById(group.getCurrent_ranking_decision()).orElse(null);
            group.setDecisionName(decision.getDecisionName());
        }
        return rankingGroups;
    }

    @Override
    public RankingGroup findRankingGroupById(int id) {
        RankingGroup group = iRankingGroupRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RankingGroup not found with id: " + id));

        // Lấy tài khoản được tạo bởi 'CreatedBy' của nhóm, nếu có, thiết lập username
        iAccount.findById(group.getCreatedBy())
                .ifPresent(account -> group.setUsername(account.getUsername()));

        // Lấy quyết định xếp hạng dựa trên groupId, nếu có, thiết lập decisionName
        RankingDecision decision = iRankingDecisionRepository.findByDecisionId(group.getCurrent_ranking_decision());
        if (decision != null) {
            group.setDecisionName(decision.getDecisionName());
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
        RankingDecision decision = iRankingDecisionRepository.findByDecisionId(rankingGroup.getCurrent_ranking_decision());
        if (decision != null) {
            createdGroup.setDecisionName(decision.getDecisionName());
        }
        return createdGroup;
    }

    @Override
    @Transactional
    public RankingGroup editRankingGroup(RankingGroup rankingGroup) {
        return iRankingGroupRepository.saveAndFlush(rankingGroup);
    }

    @Override
    public void deleteRankingGroup(int id) {
        iRankingGroupRepository.deleteById(id);
    }

    @Override
    public List<RankingGroupResponse> getAllRankingGroupResponses(List<RankingGroup> rankingGroups) {
        List<RankingGroupResponse> responseList = new ArrayList<>();
        for (RankingGroup rankingGroup : rankingGroups) {
            // Ánh xạ cơ bản từ RankingGroup sang RankingGroupResponse
            RankingGroupResponse response = modelMapper.map(rankingGroup, RankingGroupResponse.class);

            if (rankingGroup.getCurrent_ranking_decision() == null) {
                response.setCurrentRankingDecision(null);
            } else {
                RankingDecision decision = iRankingDecisionRepository
                        .findByDecisionId(rankingGroup.getCurrent_ranking_decision());
                // Thiết lập giá trị cho currentRankingDecision từ decisionName
                if (decision != null) {
                    response.setCurrentRankingDecision(decision.getDecisionName());
                } else {
                    response.setCurrentRankingDecision(null);
                }
            }
            responseList.add(response);
        }
        return responseList;
    }

    @Override
    public RankingGroupResponse getRankingGroupResponseById(RankingGroup rankingGroup) {
        RankingGroupResponse response = modelMapper.map(rankingGroup, RankingGroupResponse.class);
        response.setCurrentRankingDecision(rankingGroup.getDecisionName());
        return response;
    }

    @Override
    @Transactional
    public void createRankingGroup(AddNewGroupRequest form) {
        RankingGroup rankingGroup = RankingGroup.builder()
                .groupName(form.getGroupName())
                .createdBy(form.getCreatedBy())
                .build();
        iRankingGroupRepository.save(rankingGroup);

    }

    @Override
    @Transactional
    public void updateRankingGroup(Integer groupId, UpdateNewGroupRequest form) {
        RankingGroup group = iRankingGroupRepository.findById(groupId).orElse(null);
        if (group != null) {
            group.setGroupName(form.getGroupName());
            group.setCurrent_ranking_decision(form.getCurrentRankingDecision());
            RankingDecision decision = iRankingDecisionRepository.findById(form.getCurrentRankingDecision()).get();
            decision.setDecisionName(form.getTextDecisionName());
            group.setCreatedBy(form.getCreatedBy());
            iRankingGroupRepository.saveAndFlush(group);
        }
    }

    @Override
    @Transactional
    public void updateRankingGroupInfo(Integer groupId, UpdateGroupInfo form) {
        RankingGroup group = iRankingGroupRepository.findById(groupId).orElse(null);
        if (group != null){
            group.setGroupName(form.getGroupName());
            group.setCurrent_ranking_decision(form.getCurrentRankingDecision());
            group.setCreatedBy(form.getCreatedBy());
            iRankingGroupRepository.saveAndFlush(group);
        }
    }

    @Override
    public boolean isRankingGroupExitsByGroupName(String groupName) {
        return iRankingGroupRepository.existsByGroupName(groupName);
    }

}
