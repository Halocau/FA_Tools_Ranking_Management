package backend.service;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;

import java.util.List;

public interface IRankingDecisionService {
    public List<RankingDecision> getRankingDecisions();
    public RankingDecision getRankingDecisionById(int id);
    public RankingDecision addRankingDecision(RankingDecision rankingDecision);
    public RankingDecision updateRankingDecision(RankingDecision rankingDecision);
    public void deleteRankingDecision(int id);
    public RankingDecision findByGroupId(int groupId);
    public void updateRankingDecisionGroupIdToNull(int groupId);
    //response
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions);
}
