package backend.service;

import backend.model.dto.TitleConfiguration.OptionDTO;
import backend.model.dto.TitleConfiguration.TitleOptionDTO;
import backend.model.entity.Options;
import backend.model.entity.RankingTitle;
import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
import backend.model.form.RankingTitleOption.UpdateRankingTitleOptionRequest;
import jakarta.persistence.criteria.CriteriaBuilder.In;

import java.util.List;

public interface IRankingTitleOptionService {
    // crud
    public List<RankingTitleOption> getRankingTitleOptions();

    public RankingTitleOption findByRankingTitleIdAndOptionId(Integer rankingTitleId, Integer optionId);

    public RankingTitleOption addRankingTitleOption(RankingTitleOption rankingTitleOption);

    public RankingTitleOption updateRankingTitleOption(RankingTitleOption rankingTitleOption);

    public void deleteRankingTitleOption(Integer rankingTitleId, Integer optionId);

    // form
    public void createRankingTitleOption(AddRankingTitleOptionRequest form);
    // public void updateRankingTitleOption(UpdateRankingTitleOptionRequest
    // form,Integer rankingTitleId, Integer optionId);

    public List<TitleOptionDTO> getRankingTitleOptionByDecisionId(Integer decisionId);

    public RankingTitleOption upsertRankingTitleOption(UpdateRankingTitleOptionRequest form);

    public void updateRankingTitleOptions(List<UpdateRankingTitleOptionRequest> requests);
}
