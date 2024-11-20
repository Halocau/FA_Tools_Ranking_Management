package backend.service;

import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;

import java.util.List;

public interface IRankingTitleOptionService {
    //crud
    public List<RankingTitleOption> getRankingTitleOptions();
    public RankingTitleOption findRankingTitleOptionById(int id);
    public RankingTitleOption addRankingTitleOption(RankingTitleOption rankingTitleOption);
    public RankingTitleOption updateRankingTitleOption(RankingTitleOption rankingTitleOption);
    public void deleteRankingTitleOption(int id);
    //form
    public void createRankingTitleOption(AddRankingTitleOptionRequest form);
}
