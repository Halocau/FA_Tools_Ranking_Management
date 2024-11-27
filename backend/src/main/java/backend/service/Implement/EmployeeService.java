package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.dao.*;
import backend.model.dto.EmployeeResponse;
import backend.model.entity.*;
import backend.model.page.ResultPaginationDTO;
import backend.service.IEmployeeService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService implements IEmployeeService {
    private IEmployeeRepository iEmployeeRepository;
    private ModelMapper modelMapper;
    private IRankingTitleRepository iRankingTitleRepository;
    private IBulkRankingHistoryRepository iBulkRankingHistoryRepository;
    private IRankingGroupRepository irankingGroupRepository;
    private IRankingDecisionRepository iRankingDecisionRepository;

    @Autowired
    public EmployeeService(IEmployeeRepository iEmployeeRepository, ModelMapper modelMapper, IRankingTitleRepository iRankingTitleRepository, IBulkRankingHistoryRepository iBulkRankingHistoryRepository, IRankingGroupRepository irankingGroupRepository, IRankingDecisionRepository iRankingDecisionRepository) {
        this.iEmployeeRepository = iEmployeeRepository;
        this.modelMapper = modelMapper;
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.iBulkRankingHistoryRepository = iBulkRankingHistoryRepository;
        this.irankingGroupRepository = irankingGroupRepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
    }

    @Override
    public List<Employee> getAllEmployee(Specification<Employee> spec) {
        List<Employee> employees = iEmployeeRepository.findAll(spec);
        return employees;
    }

    @Override
    public Optional<Employee> findById(Integer id) {
        return iEmployeeRepository.findById(id);
    }


    @Override
    public void deleteEmployee(Integer id) {
        Employee employee = iEmployeeRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        iEmployeeRepository.delete(employee);
    }

    @Override
    public List<Employee> findByGroupId(Integer groupId) {
        return iEmployeeRepository.findByGroupId(groupId);
    }

    /// Response
    @Override
    public List<EmployeeResponse> getAllEmployeeResponses(List<Employee> allEmployees) {
        List<EmployeeResponse> employeeResponses = new ArrayList<>();

        for (Employee employee : allEmployees) {
            EmployeeResponse response = modelMapper.map(employee, EmployeeResponse.class);

            // Set RankingGroupName
            RankingGroup rankingGroup = irankingGroupRepository.findById(employee.getGroupId())
                    .orElseThrow(() -> new EntityNotFoundException("RankingGroup not found for group ID: " + employee.getGroupId()));
            response.setRankingGroupName(rankingGroup.getGroupName());

            // Set CurrentRankingDecision
            RankingDecision rankingDecision = iRankingDecisionRepository.findByDecisionId(employee.getRankingDecisionId());
            if (rankingDecision == null) {
                throw new EntityNotFoundException("RankingDecision not found for decision ID: " + employee.getRankingDecisionId());
            }
            response.setCurrentRankingDecision(rankingDecision.getDecisionName());

            // Set CurrentRank
            RankingTitle rankingTitle = iRankingTitleRepository.findById(employee.getRankingTitleId())
                    .orElseThrow(() -> new EntityNotFoundException("RankingTitle not found for title ID: " + employee.getRankingTitleId()));
            response.setCurrentRank(rankingTitle.getTitleName());

            employeeResponses.add(response);
        }

        return employeeResponses;
    }

    @Override
    public EmployeeResponse findEmployeeResponseById(Employee employee) {
        return modelMapper.map(employee, EmployeeResponse.class);
    }
}
