package backend.service;

import backend.model.dto.RankingGroupResponse;
import backend.model.entity.RankingGroup;
import backend.model.form.RankingGroup.AddNewGroupRequest;
import backend.model.form.RankingGroup.UpdateNewGroupRequest;
import backend.model.page.ResultPaginationDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public interface IRankingGroupService {
    public ResultPaginationDTO getAllRankingGroups(Specification<RankingGroup> spec, Pageable pageable);

    public RankingGroup findRankingGroupById(int id);

    public RankingGroup addRankingGroup(RankingGroup rankingGroup);

    public RankingGroup editRankingGroup(RankingGroup rankingGroup);

    public void deleteRankingGroup(int id);

    // response
    public List<RankingGroupResponse> getAllRankingGroupResponses(List<RankingGroup> rankingGroups);

    public RankingGroupResponse getRankingGroupResponseById(RankingGroup rankingGroup);

    // form
    public void createRankingGroup(AddNewGroupRequest form);

    public void updateRankingGroup(Integer groupId, UpdateNewGroupRequest form);

    // validate
    boolean isRankingGroupExitsByGroupName(String groupName);
}
