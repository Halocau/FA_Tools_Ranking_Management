package backend.service;

import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
import backend.model.form.RankingTitleOption.UpdateRankingTitleOptionRequest;

import java.util.List;

public interface IRankingTitleOptionService {
    //crud
    public List<RankingTitleOption> getRankingTitleOptions();
    public RankingTitleOption findByRankingTitleIdAndOptionId(Integer rankingTitleId, Integer optionId);
    public RankingTitleOption addRankingTitleOption(RankingTitleOption rankingTitleOption);
    public RankingTitleOption updateRankingTitleOption(RankingTitleOption rankingTitleOption);
    public void deleteRankingTitleOption(Integer rankingTitleId, Integer optionId);
    //form
    public void createRankingTitleOption(AddRankingTitleOptionRequest form);
//    public void updateRankingTitleOption(UpdateRankingTitleOptionRequest form,Integer rankingTitleId, Integer optionId);
}
