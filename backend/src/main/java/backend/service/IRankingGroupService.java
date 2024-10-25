package backend.service;

import backend.model.RankingGroup;

import java.util.List;

public interface IRankingGroupService {
    public List<RankingGroup> getAllRankingGroups();

    public RankingGroup findRankingGroupById(int id);

    public RankingGroup addRankingGroup(RankingGroup rankingGroup);

    public RankingGroup updateRankingGroup(RankingGroup rankingGroup);

    public void deleteRankingGroup(RankingGroup rankingGroup);
}
