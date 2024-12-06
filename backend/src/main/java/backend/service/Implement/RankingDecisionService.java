package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.IRankingDecisionRepository;
import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.RankingDecision;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.model.page.ResultPaginationDTO;
import backend.service.IRankingDecisionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

@Service
public class RankingDecisionService implements IRankingDecisionService {
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ModelMapper modelMapper;

    @Autowired
    public RankingDecisionService(IRankingDecisionRepository iRankingDecisionRepository, ModelMapper modelMapper) {
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ResultPaginationDTO getRankingDecisions(Specification<RankingDecision> spec, Pageable pageable) {
        Page<RankingDecision> pageRankingDecision = iRankingDecisionRepository.findAll(spec, pageable);
        return new PaginationUtils().buildPaginationDTO(pageRankingDecision);
    }

    /// CRUD
    @Override
    public List<RankingDecision> allRankingDecisions() {
        // Return a list of all ranking decisions
        return iRankingDecisionRepository.findAll();
    }

    @Override
    public RankingDecision getRankingDecisionById(int id) {
        // Find a ranking decision by ID, throw an exception if not found
        return iRankingDecisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ranking Decision not found with id: " + id));
    }


    @Override
    @Transactional
    public RankingDecision addRankingDecision(RankingDecision rankingDecision) {
        return iRankingDecisionRepository.save(rankingDecision);
    }

    @Override
    @Transactional
    public RankingDecision updateRankingDecision(RankingDecision rankingDecision) {
        return iRankingDecisionRepository.saveAndFlush(rankingDecision);
    }

    @Override
    @Transactional
    public void deleteRankingDecision(int id) {
        // Check if the ranking decision exists before deleting
        if (!iRankingDecisionRepository.existsById(id)) {
            throw new EntityNotFoundException("Ranking Decision not found with id: " + id);
        }
        // Delete
        iRankingDecisionRepository.deleteById(id);
    }

    @Override
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions) {
        // Convert a list of ranking decisions to DTO responses using ModelMapper
        List<RankingDecisionResponse> rankingDecisionResponses = new ArrayList<>();
        for (RankingDecision rankingDecision : rankingDecisions) {
            rankingDecisionResponses.add(modelMapper.map(rankingDecision, RankingDecisionResponse.class));
        }
        return rankingDecisionResponses;
    }

    @Override
    public RankingDecisionResponse findRankingDecisionResponseById(int id) {
        // Find ranking decision by ID and map it to a response DTO
        RankingDecision rankingDecision = iRankingDecisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ranking Decision not found with id: " + id));
        return modelMapper.map(rankingDecision, RankingDecisionResponse.class);
    }

    /// Form
    @Override
    @Transactional
    public void createRankingDecision(CreateRankingDecision form) {
        // Create a new ranking decision entity from the form data
        RankingDecision decision = RankingDecision.builder()
                .decisionName(form.getDecisionName())
                .createdBy(form.getCreatedBy())
                .status("Draft")// Set default status
                .build();
        //Save
        iRankingDecisionRepository.save(decision);
    }


    @Override
    @Transactional
    public void updateRankingDecision(UpdateRankingDecision form, int decisionId) {
        // Find existing ranking decision by ID, throw an exception if not found
        RankingDecision decision = iRankingDecisionRepository.findById(decisionId).orElseThrow(() ->
                new EntityNotFoundException("Option not found with id: " + decisionId));

        // Update decision name with the form data
        decision.setDecisionName(form.getDecisionName());

        //save
        iRankingDecisionRepository.saveAndFlush(decision);
    }

    /// Valid
    @Override
    public boolean isRankingDecisionNameExist(String decisionName) {
        // Check if a ranking decision with the given name already exists
        return iRankingDecisionRepository.existsByDecisionName(decisionName);
    }

}
