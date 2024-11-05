package backend.service.Implement;

import backend.dao.IRankingDecisionRepository;
import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.service.IRankingDecisionService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingDecisionService implements IRankingDecisionService {
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingDecisionService(IRankingDecisionRepository iRankingDecisionRepository, ModelMapper modelMapper) {
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<RankingDecision> getRankingDecisions() {
        return iRankingDecisionRepository.findAll();
    }

    @Override
    public RankingDecision getRankingDecisionById(int id) {
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
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions) {
        List<RankingDecisionResponse> rankingDecisionResponses = new ArrayList<>();
        for (RankingDecision rankingDecision : rankingDecisions) {
            rankingDecisionResponses.add(modelMapper.map(rankingDecision, RankingDecisionResponse.class));
        }
        return rankingDecisionResponses;
    }

    @Override
    public RankingDecisionResponse findRankingDecisionResponseById(int id) {
        RankingDecision rankingDecision = iRankingDecisionRepository.findById(id).orElse(null);
        return modelMapper.map(rankingDecision, RankingDecisionResponse.class);
    }

    @Override
    @Transactional
    public void createRankingDecision(CreateRankingDecision form) {
        RankingDecision decision = RankingDecision.builder()
                .decisionName(form.getDecisionName())
                .createdBy(form.getCreatedBy())
                .status("Draft")
                .build();
        iRankingDecisionRepository.save(decision);
    }

    @Override
    public boolean isRankingDecisionNameExist(String decisionName) {
        return iRankingDecisionRepository.existsByDecisionName(decisionName);
    }

//    @Override
//    @Transactional
//    public RankingDecision updateDecisionName(Integer decisionId, String decisionName) {
//        RankingDecision decision = iRankingDecisionRepository.findById(decisionId).get();
//        decision.setDecisionName(decisionName);
//        return iRankingDecisionRepository.saveAndFlush(decision);
//    }

}
