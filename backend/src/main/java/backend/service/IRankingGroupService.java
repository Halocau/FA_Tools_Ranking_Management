package backend.service;

import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingGroup;

import java.util.List;

public interface IRankingGroupService {
    public List<RankingGroup> getAllRankingGroups();

    public RankingGroup findRankingGroupById(int id);

    public RankingGroup addRankingGroup(RankingGroup rankingGroup);

    public RankingGroup updateRankingGroup(RankingGroup rankingGroup);

    public void deleteRankingGroup(RankingGroup rankingGroup);

    public List<RankingGroupResponse> getAllRankingGroupResponses(List<RankingGroup> rankingGroups);

    public RankingGroupResponse getRankingGroupResponseById(RankingGroup rankingGroup);
}
