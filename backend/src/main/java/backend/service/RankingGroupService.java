package backend.service;

import backend.dao.IRankingGroupRepository;
import backend.model.RankingGroup;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class RankingGroupService implements IRankingGroupService{
    private IRankingGroupRepository iRankingGroupRepository;
    @Autowired
    public RankingGroupService(IRankingGroupRepository iRankingGroupRepository) {
        this.iRankingGroupRepository = iRankingGroupRepository;
    }

    @Override
    public List<RankingGroup> getAllRankingGroups() {
        return iRankingGroupRepository.findAll();
    }

    @Override
    public RankingGroup findRankingGroupById(int id) {
        return iRankingGroupRepository.findById(id).get();
    }

    @Override
    @Transactional
    public RankingGroup addRankingGroup(RankingGroup rankingGroup) {
        return iRankingGroupRepository.save(rankingGroup);
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
