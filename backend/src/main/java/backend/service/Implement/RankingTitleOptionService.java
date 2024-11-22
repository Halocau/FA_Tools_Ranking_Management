package backend.service.Implement;

import backend.dao.IOptionRepository;
import backend.dao.IRankingTitleOptionRepository;
import backend.dao.IRankingTitleRepository;
import backend.model.dto.TitleConfiguration.OptionDTO;
import backend.model.dto.TitleConfiguration.TitleOptionDTO;
import backend.model.entity.Options;
import backend.model.entity.RankingTitle;
import backend.model.entity.RankingTitleOption;
import backend.model.entity.Serializable.RankingTitleOptionSerializable;
import backend.model.form.RankingTitleOption.AddRankingTitleOptionRequest;
import backend.model.form.RankingTitleOption.UpdateRankingTitleOptionRequest;
import backend.service.IRankingTitleOptionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RankingTitleOptionService implements IRankingTitleOptionService {

    private final IRankingTitleOptionRepository irankingTitleOptionRepository;
    private final IRankingTitleRepository irankingTitleRepository;
    private final IOptionRepository iOptionRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public RankingTitleOptionService(
            IRankingTitleOptionRepository irankingTitleOptionRepository,
            IRankingTitleRepository irankingTitleRepository,
            IOptionRepository iOptionRepository,
            ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.irankingTitleOptionRepository = irankingTitleOptionRepository;
        this.irankingTitleRepository = irankingTitleRepository;
        this.iOptionRepository = iOptionRepository;
    }

    @Override
    public List<RankingTitleOption> getRankingTitleOptions() {
        return irankingTitleOptionRepository.findAll();
    }

    @Override
    public RankingTitleOption findByRankingTitleIdAndOptionId(Integer rankingTitleId, Integer optionId) {
        return irankingTitleOptionRepository.findByRankingTitleIdAndOptionId(rankingTitleId, optionId);
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
    public void deleteRankingTitleOption(Integer rankingTitleId, Integer optionId) {
        RankingTitleOptionSerializable id = new RankingTitleOptionSerializable(rankingTitleId, optionId);
        Optional<RankingTitleOption> find = irankingTitleOptionRepository.findById(id);
        if (find.isPresent()) {
            irankingTitleOptionRepository.delete(find.get());
        } else {
            throw new EntityNotFoundException(
                    "Ranking Title Option with rankingTitleId " + rankingTitleId + " and optionId " + optionId
                            + " not found.");
        }
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

    @Override
    public List<TitleOptionDTO> getRankingTitleOptionByDecisionId(Integer decisionId) {
        List<TitleOptionDTO> listTitleOptionDTO = new ArrayList<>();

        List<RankingTitle> listRankingTitle = irankingTitleRepository.findByDecisionId(decisionId);

        for (RankingTitle rankingTitle : listRankingTitle) {
            TitleOptionDTO titleOptionDTO = new TitleOptionDTO();

            List<RankingTitleOption> listRankingTitleOption = irankingTitleOptionRepository
                    .findByRankingTitleId(rankingTitle.getRankingTitleId());

            List<Options> listOption = new ArrayList<>();
            List<OptionDTO> listOptionDTO1 = new ArrayList<>();
            for (RankingTitleOption rto : listRankingTitleOption) {
                Options option = iOptionRepository.findById(rto.getOptionId()).orElseThrow(
                        () -> new EntityNotFoundException("Option with ID " + rto.getOptionId() + " not found"));
                listOption.add(option);
                listOptionDTO1.add(modelMapper.map(option, OptionDTO.class));
            }

            titleOptionDTO.setRankingTitleId(rankingTitle.getRankingTitleId());
            titleOptionDTO.setRankingTitleName(rankingTitle.getTitleName());
            titleOptionDTO.setTotalScore(rankingTitle.getTotalScore());
            titleOptionDTO.setOptions(listOptionDTO1);
            listTitleOptionDTO.add(titleOptionDTO);
        }
        return listTitleOptionDTO;
    }

    @Override
    @Transactional
    public RankingTitleOption upsertRankingTitleOption(UpdateRankingTitleOptionRequest request) {

        // Validate inputs
        if (request.getRankingTitleId() == null || request.getOptionId() == null) {
            RankingTitleOption newOption = RankingTitleOption.builder()
                    .rankingTitleId(request.getNewRankingTitleId())
                    .optionId(request.getNewOptionId())
                    .build();
            return irankingTitleOptionRepository.save(newOption);
        }

        // Check if an existing record with the old keys exists
        RankingTitleOption existingOption = irankingTitleOptionRepository.findByRankingTitleIdAndOptionId(
                request.getRankingTitleId(), request.getOptionId());

        if (existingOption != null) {
            // Check if the primary key needs to change
            if (!existingOption.getRankingTitleId().equals(request.getNewRankingTitleId()) ||
                    !existingOption.getOptionId().equals(request.getNewOptionId())) {
                // If yes, delete the old record
                irankingTitleOptionRepository.delete(existingOption);

                // Create a new record with the new keys
                RankingTitleOption newOption = RankingTitleOption.builder()
                        .rankingTitleId(request.getNewRankingTitleId())
                        .optionId(request.getNewOptionId())
                        .build();
                return irankingTitleOptionRepository.save(newOption);
            } else {
                // If no, return the existing record as no changes are necessary
                return existingOption;
            }
        } else {
            // Create a new record if no matching old record is found
            RankingTitleOption newOption = RankingTitleOption.builder()
                    .rankingTitleId(request.getNewRankingTitleId())
                    .optionId(request.getNewOptionId())
                    .build();
            return irankingTitleOptionRepository.save(newOption);
        }
    }
}
