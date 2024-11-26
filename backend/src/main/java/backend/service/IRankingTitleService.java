package backend.service;

import backend.model.dto.RankingGroupResponse;
import backend.model.dto.RankingTitleResponse;
import backend.model.dto.TitleConfiguration.DecisionCriteriaDTO;
import backend.model.entity.RankingTitle;
import backend.model.form.RankingTitle.AddRankingTitleRequest;

import java.util.List;

public interface IRankingTitleService {
    //crud
    public List<RankingTitle> getRankingTitle();
    public RankingTitle findRankingTitleById(int id);
    public RankingTitle addRankingTitle(RankingTitle rankingTitle);
    public RankingTitle updateRankingTitle(RankingTitle rankingTitle);
    public void deleteRankingTitle(int id);
    public List<RankingTitle> findByDecisionId(Integer decisionId);

    //response
    public List<RankingTitleResponse> getRankingTittleResponse(List<RankingTitle> listRankingTitle);
    public RankingTitleResponse findRankingTitleResponse(RankingTitle rankingTitle);
    //form
    public void createRankingTitleByForm(AddRankingTitleRequest form);
}
