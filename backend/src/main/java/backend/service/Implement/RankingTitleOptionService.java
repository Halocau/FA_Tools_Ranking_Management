package backend.service.Implement;

import backend.dao.IOptionRepository;
import backend.dao.IRankingTitleOptionRepository;
import backend.dao.IRankingTitleRepository;
import backend.model.dto.TitleConfiguration.OptionDTO;
import backend.model.dto.TitleConfiguration.TitleOptionDTO;
import backend.model.entity.Options;
import backend.model.entity.RankingTitle;
import backend.model.entity.RankingTitleOption;
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

@Service
public class RankingTitleOptionService implements IRankingTitleOptionService {

    private IRankingTitleOptionRepository irankingTitleOptionRepository;
    private IRankingTitleRepository irankingTitleRepository;
    private IOptionRepository iOptionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingTitleOptionService(IRankingTitleOptionRepository irankingTitleOptionRepository,
            IRankingTitleRepository irankingTitleRepository, IOptionRepository iOptionRepository,
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

    // @Override
    // public RankingTitleOption findRankingTitleOptionById(int id) {
    // return irankingTitleOptionRepository.findById(id)
    // .orElseThrow(() -> new EntityNotFoundException("Ranking Title Option with ID
    // " + id + " Not Found"));
    // }

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
        RankingTitleOption find = irankingTitleOptionRepository.findByRankingTitleIdAndOptionId(rankingTitleId,
                optionId);
        if (find != null) {
            irankingTitleOptionRepository.delete(find);
        } else {
            throw new EntityNotFoundException("Ranking Title Option with rankingTitleId " + rankingTitleId
                    + " and optionId " + optionId + " Not Found");
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
                Options option = iOptionRepository.findById(rto.getOptionId()).get();
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

    // @Override
    // @Transactional
    // public void updateRankingTitleOption(UpdateRankingTitleOptionRequest form,
    // Integer rankingTitleId, Integer optionId) {
    // if (form == null) {
    // throw new IllegalArgumentException("Form cannot be null");
    // }
    //
    // RankingTitleOption existingOption =
    // irankingTitleOptionRepository.findByRankingTitleIdAndOptionId(rankingTitleId,
    // optionId);
    //
    // if (existingOption != null) {
    // // Nếu tìm thấy, cập nhật giá trị
    // existingOption.setRankingTitleId(form.getRankingTitleId());
    // existingOption.setOptionId(form.getOptionId());
    // irankingTitleOptionRepository.save(existingOption);
    // } else {
    // // Nếu không tìm thấy, tạo mới bản ghi
    // RankingTitleOption newOption = RankingTitleOption.builder()
    // .rankingTitleId(form.getRankingTitleId())
    // .optionId(form.getOptionId())
    // .build();
    // irankingTitleOptionRepository.save(newOption);
    // }
    // }

}
