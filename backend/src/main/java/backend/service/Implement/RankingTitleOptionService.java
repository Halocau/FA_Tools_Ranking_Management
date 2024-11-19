package backend.service.Implement;

import backend.dao.IRankingTitleOptionRepository;
import backend.model.entity.RankingTitleOption;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
import backend.service.IRankingTitleOptionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RankingTitleOptionService implements IRankingTitleOptionService {
    private IRankingTitleOptionRepository irankingTitleOptionRepository;

    @Autowired
    public RankingTitleOptionService(IRankingTitleOptionRepository irankingTitleOptionRepository) {
        this.irankingTitleOptionRepository = irankingTitleOptionRepository;
    }

    @Override
    public List<RankingTitleOption> getRankingTitleOptions() {
        return irankingTitleOptionRepository.findAll();
    }

    @Override
    public RankingTitleOption findRankingTitleOptionById(int id) {
        return irankingTitleOptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ranking Title Option with ID " + id + " Not Found"));
    }

    @Override
    @Transactional
    public RankingTitleOption addRankingTitleOption(RankingTitleOption rankingTitleOption) {
        return irankingTitleOptionRepository.save(rankingTitleOption);
    }

    @Override
    @Transactional
    public RankingTitleOption updateRankingTitleOption(RankingTitleOption rankingTitleOption) {
        return irankingTitleOptionRepository.saveAndFlush(rankingTitleOption);
    }

    @Override
    @Transactional
    public void deleteRankingTitleOption(int id) {
        irankingTitleOptionRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void createRankingTitleOption(AddRankingTitleOptionRequest form) {
        RankingTitleOption rankingTitleOption = RankingTitleOption.builder()
                .rankingTitleId(form.getRankingTitleId())
                .optionId(form.getOptionId())
                .build();
        irankingTitleOptionRepository.save(rankingTitleOption);
    }
}
