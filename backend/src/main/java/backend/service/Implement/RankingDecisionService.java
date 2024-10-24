package backend.service.Implement;

import backend.dao.IRankingDecisionRepository;
import backend.model.entity.RankingDecision;
import backend.service.IRankingDecisionService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankingDecisionService implements IRankingDecisionService {
    private IRankingDecisionRepository iRankingDecisionRepository;

    @Autowired
    public RankingDecisionService(IRankingDecisionRepository iRankingDecisionRepository) {
        this.iRankingDecisionRepository = iRankingDecisionRepository;
    }

    @Override
    public List<RankingDecision> getRankingDecisions() {
        return iRankingDecisionRepository.findAll();
    }

    @Override
    public RankingDecision getRankingDecision(int id) {
        return iRankingDecisionRepository.findById(id).get();
    }

    @Override
    @Transactional
    public RankingDecision addRankingDecision(RankingDecision rankingDecision) {
        return iRankingDecisionRepository.save(rankingDecision);
    }

    @Override
    @Transactional
    public RankingDecision updateRankingDecision(RankingDecision rankingDecision) {
        return iRankingDecisionRepository.saveAndFlush(rankingDecision);
    }

    @Override
    @Transactional
    public void deleteRankingDecision(int id) {
        iRankingDecisionRepository.deleteById(id);
    }

    @Override
    public RankingDecision findByGroupId(int groupId) {
        return iRankingDecisionRepository.findByGroupId(groupId);
    }

    @Override
    @Transactional
    public void updateRankingDecisionGroupIdToNull(int groupId) {
        iRankingDecisionRepository.updateRankingDecisionGroupIdToNull(groupId);
    }


}
