package backend.service.Implement;

import backend.dao.IAccount;
import backend.dao.IRankingDecisionRepository;
import backend.dao.IRankingGroupRepository;
import backend.model.dto.RankingGroupResponse;
import backend.model.entity.Account;
import backend.model.entity.RankingDecision;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
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
    public RankingGroupService(ModelMapper modelMapper, IRankingGroupRepository iRankingGroupRepository, IAccount iAccount, IRankingDecisionRepository iRankingDecisionRepository, ModelMapper modelMapper1) {
        super(modelMapper);
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iAccount = iAccount;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper1;
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
    public void deleteRankingGroup(int id) {
        iRankingGroupRepository.deleteById(id);
    }


    @Override
    public List<RankingGroupResponse> getAllRankingGroupResponses(List<RankingGroup> rankingGroups) {
        List<RankingGroupResponse> responseList = new ArrayList<>();
        for (RankingGroup rankingGroup : rankingGroups) {
            // Ánh xạ cơ bản từ RankingGroup sang RankingGroupResponse
            RankingGroupResponse response = modelMapper.map(rankingGroup, RankingGroupResponse.class);

            // Thiết lập giá trị cho currentRankingDecision từ decisionName
            response.setCurrentRankingDecision(rankingGroup.getDecisionName());
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
        // Tạo đối tượng RankingGroup từ đối tượng form
        RankingGroup rankingGroup = RankingGroup.builder()
                .groupName(form.getGroupName())
                .createdBy(form.getCreatedBy())
                .build();

        // Lưu đối tượng RankingGroup vào cơ sở dữ liệu
        iRankingGroupRepository.save(rankingGroup);

    }

    @Override
    public boolean isRankingGroupExitsByGroupName(String groupName) {
        return iRankingGroupRepository.existsByGroupName(groupName);
    }


}
