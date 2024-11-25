package backend.service.Implement;

import backend.dao.*;
import backend.model.dto.ApplyCriteriaResponse;
import backend.model.dto.EmployeeCriteriaResponse;
import backend.model.entity.*;
import backend.model.form.EmployeeCriteria.UpsertEmployeeCriteriaRequest;
import backend.service.IEmployeeCriteriaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EmployeeCriteriaService implements IEmployeeCriteriaService {
    private IEmployeeCriteriaRepository iEmployeeCriteriaRepository;
    private IEmployeeRepository iEmployeeRepository;
    private ModelMapper modelMapper;
    private IRankingTitleRepository iRankingTitleRepository;
    private IBulkRankingHistoryRepository iBulkRankingHistoryRepository;
    private IRankingGroupRepository irankingGroupRepository;
    private IRankingDecisionRepository iRankingDecisionRepository;
    private ICriteriaRepository iCriteriaRepository;
    private IOptionRepository iOptionRepository;

    @Autowired
    public EmployeeCriteriaService(IEmployeeCriteriaRepository iEmployeeCriteriaRepository, IEmployeeRepository iEmployeeRepository, ModelMapper modelMapper, IRankingTitleRepository iRankingTitleRepository, IBulkRankingHistoryRepository iBulkRankingHistoryRepository, IRankingGroupRepository irankingGroupRepository, IRankingDecisionRepository iRankingDecisionRepository, ICriteriaRepository iCriteriaRepository, IOptionRepository iOptionRepository) {
        this.iEmployeeCriteriaRepository = iEmployeeCriteriaRepository;
        this.iEmployeeRepository = iEmployeeRepository;
        this.modelMapper = modelMapper;
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.iBulkRankingHistoryRepository = iBulkRankingHistoryRepository;
        this.irankingGroupRepository = irankingGroupRepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.iCriteriaRepository = iCriteriaRepository;
        this.iOptionRepository = iOptionRepository;
    }

    /// CRUD
    @Override
    public List<EmployeeCriteria> getEmployeeCriteria() {
        return iEmployeeCriteriaRepository.findAll();
    }

    @Override
    public EmployeeCriteria findByEmployeeIdAndCriteriaId(Integer employeeId, Integer criteriaId) {
        return iEmployeeCriteriaRepository.findByEmployeeIdAndCriteriaId(employeeId, criteriaId);
    }

    // find list id
    @Override
    public List<EmployeeCriteria> findByEmployeeId(Integer employeeId) {
        return iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
    }

    // delete all
    @Override
    public void deleteByEmployeeId(Integer employeeId) {
        List<EmployeeCriteria> find = iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
        iEmployeeCriteriaRepository.deleteAll(find);
    }

    /// FORM
    @Override
    @Transactional
    public void upsertEmployeeCriteria(UpsertEmployeeCriteriaRequest form, Integer employeeId, Integer criteriaId) {
        EmployeeCriteria exits = iEmployeeCriteriaRepository.findByEmployeeIdAndCriteriaId(employeeId, criteriaId);
        if (exits != null) {
            //Update
            EmployeeCriteria update = new EmployeeCriteria();
            update.setEmployeeId(employeeId);
            update.setCriteriaId(criteriaId);
            update.setOptionId(form.getOptionId());
            iEmployeeCriteriaRepository.saveAndFlush(update);

        } else {
            //Insert
            EmployeeCriteria create = EmployeeCriteria.builder()
                    .employeeId(form.getEmployeeId())
                    .criteriaId(form.getCriteriaId())
                    .optionId(form.getOptionId())
                    .build();
            iEmployeeCriteriaRepository.save(create);
        }

    }

    @Override
    @Transactional
    public void upsertEmployeeCriteriaList(List<UpsertEmployeeCriteriaRequest> forms) {
        if (forms == null || forms.isEmpty()) {
            throw new IllegalArgumentException("The list of forms cannot be null or empty");
        }
        //loop update or insert
        for (UpsertEmployeeCriteriaRequest form : forms) {
            upsertEmployeeCriteria(form, form.getEmployeeId(), form.getCriteriaId());
        }
    }

    @Override
    public List<EmployeeCriteriaResponse> getEmployeeCriteriaResponse(List<EmployeeCriteria> listEmployeeCriteria) {
        // Validate that the input list is not null or empty
        if (listEmployeeCriteria == null || listEmployeeCriteria.isEmpty()) {
            throw new IllegalArgumentException("Employee criteria list cannot be null or empty.");
        }

        List<EmployeeCriteriaResponse> employeeCriteriaResponses = new ArrayList<>();
        Map<Integer, EmployeeCriteriaResponse> responseMap = new HashMap<>();

        for (EmployeeCriteria employeeCriteria : listEmployeeCriteria) {
            // Check if the response for this employee ID already exists
            EmployeeCriteriaResponse response = responseMap.get(employeeCriteria.getEmployeeId());
            if (response == null) {
                // If not, create a new EmployeeCriteriaResponse
                response = new EmployeeCriteriaResponse();
                Optional<Employee> findEmployee = iEmployeeRepository.findById(employeeCriteria.getEmployeeId());
                if (findEmployee.isPresent()) {
                    Employee employee = findEmployee.get();

                    // Ensure employee ID and name are not null
                    if (employee.getEmployeeId() == null || employee.getEmployeeName() == null) {
                        throw new IllegalStateException("Employee ID or name is missing for employee: " + employee.getEmployeeId());
                    }
                    response.setEmployeeId(employee.getEmployeeId());
                    response.setEmployeeName(employee.getEmployeeName());

                    // Validate group ID and fetch RankingGroup
                    if (employee.getGroupId() == null) {
                        throw new IllegalStateException("Group ID is missing for employee: " + employee.getEmployeeId());
                    }
                    RankingGroup rankingGroup = irankingGroupRepository.findById(employee.getGroupId())
                            .orElseThrow(() -> new EntityNotFoundException("RankingGroup not found for group ID: " + employee.getGroupId()));
                    response.setRankingGroupName(rankingGroup.getGroupName());

                    // Validate ranking decision ID and fetch RankingDecision
                    if (employee.getRankingDecisionId() == null) {
                        throw new IllegalStateException("Ranking decision ID is missing for employee: " + employee.getEmployeeId());
                    }
                    RankingDecision rankingDecision = iRankingDecisionRepository.findByDecisionId(employee.getRankingDecisionId());
                    if (rankingDecision == null) {
                        throw new EntityNotFoundException("RankingDecision not found for decision ID: " + employee.getRankingDecisionId());
                    }
                    response.setCurrentRankingDecision(rankingDecision.getDecisionName());

                    // Validate ranking title ID and fetch RankingTitle
                    if (employee.getRankingTitleId() == null) {
                        throw new IllegalStateException("Ranking title ID is missing for employee: " + employee.getEmployeeId());
                    }
                    RankingTitle rankingTitle = iRankingTitleRepository.findById(employee.getRankingTitleId())
                            .orElseThrow(() -> new EntityNotFoundException("RankingTitle not found for title ID: " + employee.getRankingTitleId()));
                    response.setCurrentRank(rankingTitle.getTitleName());

                    // Add the response to the map
                    responseMap.put(employee.getEmployeeId(), response);
                }
            }

            // Process criteria list and avoid duplicates
            List<EmployeeCriteria> employeeCriteriaList = iEmployeeCriteriaRepository.findByEmployeeId(employeeCriteria.getEmployeeId());
            Set<String> criteriaSet = new HashSet<>(); // Set to track duplicates
            List<ApplyCriteriaResponse> applyCriteriaList = new ArrayList<>();

            for (EmployeeCriteria empCriteria : employeeCriteriaList) {
                // Validate and fetch Criteria
                Criteria criteria = iCriteriaRepository.findById(empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("Criteria not found for criteria ID: " + empCriteria.getCriteriaId()));

                // Validate and fetch Option
                Options option = iOptionRepository.findById(empCriteria.getOptionId())
                        .orElseThrow(() -> new EntityNotFoundException("Option not found for option ID: " + empCriteria.getOptionId()));

                // Ensure criteria name and option name are not null
                if (criteria.getCriteriaName() == null || option.getOptionName() == null) {
                    throw new IllegalStateException("Criteria name or option name cannot be null.");
                }

                // Create a unique key for criteria + option to avoid duplicates
                String uniqueKey = criteria.getCriteriaName() + "-" + option.getOptionName();
                if (!criteriaSet.contains(uniqueKey)) {
                    // Add non-duplicate criteria to the response
                    ApplyCriteriaResponse applyCriteriaResponse = new ApplyCriteriaResponse();
                    applyCriteriaResponse.setCirteriaName(criteria.getCriteriaName());
                    applyCriteriaResponse.setOptionName(option.getOptionName());

                    applyCriteriaList.add(applyCriteriaResponse);
                    criteriaSet.add(uniqueKey); // Mark as processed
                }
            }

            // Assign the unique criteria list to the response
            response.setCriteriaList(applyCriteriaList);
        }

        // Add all responses from the map to the result list
        employeeCriteriaResponses.addAll(responseMap.values());
        return employeeCriteriaResponses;
    }
}
