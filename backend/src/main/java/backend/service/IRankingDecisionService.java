package backend.service;

import backend.model.RankingDecision;

import java.util.List;
import java.util.Optional;

public interface IRankingDecisionService {
    public List<RankingDecision> getRankingDecisions();
    public RankingDecision getRankingDecision(int id);
    public RankingDecision addRankingDecision(RankingDecision rankingDecision);
    public RankingDecision updateRankingDecision(RankingDecision rankingDecision);
    public void deleteRankingDecision(int id);
    public RankingDecision findByGroupId(int groupId);
}
