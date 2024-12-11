package backend.service;

import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.AddCloneRankingDecisionRequest;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.model.form.RankingDecision.UpdateStatusRankingDecisionRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IRankingDecisionService {
    public ResultPaginationDTO getRankingDecisions(Specification<RankingDecision> spec, Pageable pageable);

    public RankingDecision getRankingDecisionById(int id);

    public RankingDecision addRankingDecision(RankingDecision rankingDecision);

    public RankingDecision updateRankingDecision(RankingDecision rankingDecision);

    public void deleteRankingDecision(int id);
    public List<RankingDecision> allRankingDecisions();
    // response
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions);
    public RankingDecisionResponse findRankingDecisionResponseById(int id);
    // form
    public RankingDecision createRankingDecision(CreateRankingDecision form);
    public void updateRankingDecision(UpdateRankingDecision form, int decisionId);
    public RankingDecision updateStatus(UpdateStatusRankingDecisionRequest form);
    // validate
    boolean isRankingDecisionNameExist(String decisionName);

    // apply form updateAddNewGroup
    // public RankingDecision updateDecisionName(Integer decisionId, String
    // decisionName);

}
