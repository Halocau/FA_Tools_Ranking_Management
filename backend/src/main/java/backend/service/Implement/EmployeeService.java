package backend.service.Implement;

import backend.dao.*;
import backend.model.dto.EmployeeResponse;
import backend.model.entity.*;
import backend.model.form.Employee.UpsertEmployeeRequest;
import backend.service.IEmployeeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class EmployeeService implements IEmployeeService {
    private IEmployeeRepository iEmployeeRepository;
    private ModelMapper modelMapper;
    private IRankingGroupRepository irankingGroupRepository;
    private IRankingDecisionRepository iRankingDecisionRepository;
    private EmployeeCriteriaService employeeCriteriaService;

    @Autowired
    public EmployeeService(IEmployeeRepository iEmployeeRepository, ModelMapper modelMapper, IRankingGroupRepository irankingGroupRepository, IRankingDecisionRepository iRankingDecisionRepository, EmployeeCriteriaService employeeCriteriaService) {
        this.iEmployeeRepository = iEmployeeRepository;
        this.modelMapper = modelMapper;
        this.irankingGroupRepository = irankingGroupRepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.employeeCriteriaService = employeeCriteriaService;
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
//        if (allEmployees.isEmpty()) {
//            throw new EntityNotFoundException("No employees found.");
//        }

        // Lấy tất cả các RankingGroup và RankingDecision cần thiết trong một lần
        List<Integer> groupIds = allEmployees.stream().map(Employee::getGroupId).distinct().collect(Collectors.toList());
        Map<Integer, RankingGroup> rankingGroupMap = irankingGroupRepository.findAllById(groupIds)
                .stream().collect(Collectors.toMap(RankingGroup::getGroupId, Function.identity()));

        Map<Integer, RankingDecision> rankingDecisionMap = allEmployees.stream()
                .map(Employee::getRankingDecisionId)
                .distinct()
                .map(decisionId -> iRankingDecisionRepository.findByDecisionId(decisionId))
                .collect(Collectors.toMap(RankingDecision::getDecisionId, Function.identity()));

        List<EmployeeResponse> employeeResponses = new ArrayList<>();

        for (Employee employee : allEmployees) {
            EmployeeResponse response = modelMapper.map(employee, EmployeeResponse.class);

            // Set RankingGroupName
            RankingGroup rankingGroup = rankingGroupMap.get(employee.getGroupId());
            if (rankingGroup == null) {
                throw new EntityNotFoundException("RankingGroup not found for group ID: " + employee.getGroupId());
            }
            response.setRankingGroupName(rankingGroup.getGroupName());

            // Set CurrentRankingDecision
            RankingDecision rankingDecision = rankingDecisionMap.get(employee.getRankingDecisionId());
            if (rankingDecision == null) {
                throw new EntityNotFoundException("RankingDecision not found for decision ID: " + employee.getRankingDecisionId());
            }
            response.setCurrentRankingDecision(rankingDecision.getDecisionName());

            // Tính toán currentRank
            String currentRank = employeeCriteriaService.getCurrentRankForEmployee(employee.getEmployeeId());
            response.setCurrentRank(currentRank);

            employeeResponses.add(response);
        }

        return employeeResponses;
    }

    @Override
    public EmployeeResponse findEmployeeResponseById(Employee employee) {
        return modelMapper.map(employee, EmployeeResponse.class);
    }

    @Override
    @Transactional
    public void upsertEmployee(UpsertEmployeeRequest form, Integer employeeId) {
        Optional<Employee> exist = iEmployeeRepository.findById(employeeId);
        if (exist.isPresent()) {
            //Update
            Employee employee = new Employee();
            employee.setEmployeeId(form.getEmployeeId());
            employee.setEmployeeName(form.getEmployeeName());
            employee.setGroupId(form.getGroupId());
//            employee.setRankingTitleId(form.getRankingTitleId());
            employee.setBulkImportId(form.getBulkImportId());
            employee.setRankingDecisionId(form.getRankingDecisionId());
            iEmployeeRepository.saveAndFlush(employee);
        } else {
            //Insert
            Employee newEmployee = Employee.builder()
                    .employeeId(form.getEmployeeId())
                    .employeeName(form.getEmployeeName())
                    .groupId(form.getGroupId())
//                    .rankingTitleId(form.getRankingTitleId())
                    .bulkImportId(form.getBulkImportId())
                    .rankingDecisionId(form.getRankingDecisionId())
                    .build();
            iEmployeeRepository.save(newEmployee);
        }
    }

    @Override
    public void upsertEmployeeList(List<UpsertEmployeeRequest> forms) {
        if (forms == null || forms.isEmpty()) {
            throw new IllegalArgumentException("The list of forms cannot be null or empty");
        }
        for (UpsertEmployeeRequest form : forms) {
            upsertEmployee(form, form.getEmployeeId());
        }
    }
}
