package backend.service.Implement;

import backend.dao.IRankingTitleRepository;
import backend.model.dto.RankingGroupResponse;
import backend.model.dto.RankingTitleResponse;
import backend.model.entity.RankingTitle;
import backend.model.form.RankingTitle.AddRankingTitleRequest;
import backend.service.IRankingTitleService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingTitleService implements IRankingTitleService {
    private IRankingTitleRepository iRankingTitleRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingTitleService(IRankingTitleRepository iRankingTitleRepository, ModelMapper modelMapper) {
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.modelMapper = modelMapper;
    }

    /**
     * CRUD
     */
    @Override
    public List<RankingTitle> getRankingTitle() {
        return iRankingTitleRepository.findAll();
    }

    @Override
    public RankingTitle findRankingTitleById(int id) {
        return iRankingTitleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RankingTitle with ID " + id + " does not exist."));
    }


    @Override
    @Transactional
    public RankingTitle addRankingTitle(RankingTitle rankingTitle) {
        return iRankingTitleRepository.save(rankingTitle);
    }

    @Override
    @Transactional
    public RankingTitle updateRankingTitle(RankingTitle rankingTitle) {
        return iRankingTitleRepository.saveAndFlush(rankingTitle);
    }

    @Override
    @Transactional
    public void deleteRankingTitle(int id) {
        iRankingTitleRepository.deleteById(id);
    }

    /**
     * Response
     */
    @Override
    public List<RankingTitleResponse> getRankingTittleResponse(List<RankingTitle> listRankingTitle) {
        List<RankingTitleResponse> rankingTitleResponses = new ArrayList<>();
        for (RankingTitle rankingTitle : listRankingTitle) {
            //convert RankingTitle -> RankingTitleResponse
            RankingTitleResponse response = modelMapper.map(rankingTitle, RankingTitleResponse.class);
            rankingTitleResponses.add(response);
        }
        return rankingTitleResponses;
    }

    @Override
    public RankingTitleResponse findRankingTitleResponse(RankingTitle rankingTitle) {
        RankingTitleResponse response = modelMapper.map(rankingTitle, RankingTitleResponse.class);
        return response;
    }

    /**
     * Form
     */
    @Override
    @Transactional
    public void createRankingTitleByForm(AddRankingTitleRequest form) {
        RankingTitle rankingTitle = RankingTitle.builder()
                .decisionId(form.getDecisionId())
                .titleName(form.getTitleName())
                .build();
        iRankingTitleRepository.save(rankingTitle);
    }

}
