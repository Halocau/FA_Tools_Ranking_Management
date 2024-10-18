package backend.service;

import backend.dao.IAccount;
import backend.dao.IRankingGroupRepository;
import backend.model.Account;
import backend.model.RankingGroup;
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

    @Autowired
    public RankingGroupService(IRankingGroupRepository iRankingGroupRepository, IAccount iAccount) {
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iAccount = iAccount;
    }


    //    @Override
//    public List<RankingGroup> getAllRankingGroups() {
//        return iRankingGroupRepository.findAll();
//    }
    @Override
    public List<RankingGroup> getAllRankingGroups() {
        List<RankingGroup> rankingGroups = iRankingGroupRepository.findAll();
        for (RankingGroup group : rankingGroups) {
            // Lấy thông tin tài khoản từ ID
            Optional<Account> optionalAccount = iAccount.findById(group.getCreatedBy());
            if (optionalAccount.isPresent()) {
                Account account = optionalAccount.get(); // Lấy tài khoản
                group.setUsername(account.getUsername()); // Thiết lập username
            }
        }
        return rankingGroups;
    }

    @Override
    public RankingGroup findRankingGroupById(int id) {
        Optional<RankingGroup> optionalGroup = iRankingGroupRepository.findById(id);
        if (optionalGroup.isPresent()) {
            RankingGroup group = optionalGroup.get(); // Lấy nhóm xếp hạng
            Optional<Account> optionalAccount = iAccount.findById(group.getCreatedBy());
            if (optionalAccount.isPresent()) {
                Account account = optionalAccount.get(); // Lấy tài khoản
                group.setUsername(account.getUsername()); // Thiết lập username
            }
            return group;
        } else {
            throw new ResourceNotFoundException("RankingGroup not found with id: " + id); // Ném ngoại lệ nếu không tìm thấy
        }

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
