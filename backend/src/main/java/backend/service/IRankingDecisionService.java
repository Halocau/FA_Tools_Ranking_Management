package backend.service;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;

import java.util.List;

public interface IRankingDecisionService {
    public List<RankingDecision> getRankingDecisions();

    public RankingDecision getRankingDecisionById(int id);

    public RankingDecision addRankingDecision(RankingDecision rankingDecision);

    public RankingDecision updateRankingDecision(RankingDecision rankingDecision);

    public void deleteRankingDecision(int id);

    // response
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions);
    public RankingDecisionResponse findRankingDecisionResponseById(int id);
    // form
    public void createRankingDecision(CreateRankingDecision form);
    public void updateRankingDecision(UpdateRankingDecision form, int decisionId);

    // validate
    boolean isRankingDecisionNameExist(String decisionName);

    // apply form updateAddNewGroup
    // public RankingDecision updateDecisionName(Integer decisionId, String
    // decisionName);

}
