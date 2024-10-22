package backend.service;

import backend.model.dto.RankingGroupDTO;

import java.util.List;

public interface IRankingGroupDTOService {
    public List<RankingGroupDTO> getAllRankingGroups();
    public RankingGroupDTO findRankingGroupById(int id);
    public RankingGroupDTO addRankingGroup(RankingGroupDTO rankingGroup);
    public RankingGroupDTO updateRankingGroup(RankingGroupDTO rankingGroup);
    public void deleteRankingGroup(RankingGroupDTO rankingGroup);
}
