package backend.service.Implement;

import backend.config.common.PaginationUtils;
import backend.config.exception.exceptionEntity.RankingDecisionException;
import backend.dao.*;
import backend.model.dto.RankingDecisionResponse;
import backend.model.entity.*;
import backend.model.form.RankingDecision.AddCloneRankingDecisionRequest;
import backend.model.form.RankingDecision.CreateRankingDecision;
import backend.model.form.RankingDecision.UpdateRankingDecision;
import backend.model.form.RankingDecision.UpdateStatusRankingDecisionRequest;
import backend.model.page.ResultPaginationDTO;
import backend.service.IDecisionCriteriaService;
import backend.service.IRankingDecisionService;
import backend.service.IRankingTitleOptionService;
import backend.service.ITaskWagesService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RankingDecisionService implements IRankingDecisionService {
    private IRankingDecisionRepository iRankingDecisionRepository;
    private IEmployeeRepository iEmployeeRepository;
    private ModelMapper modelMapper;
    private IRankingGroupRepository iRankingGroupRepository;
    private IDecisionCriteriaRepository iDecisionCriteriaRepository;
    private IDecisionTasksRepository iDecisionTasksRepository;
    private IRankingTitleRepository iRankingTitleRepository;
    private IDecisionCriteriaService iDecisionCriteriaService;
    private IDecisionCriteriaService iDecisionTasksService;
    private IAccount iAccount;
    private IRankingTitleOptionRepository iRankingTitleOptionRepository;
    private IRankingTitleOptionService rankingTitleOptionService;
    private ITaskWagesService taskWagesService;
    private ITaskWagesRepository iTaskWagesRepository;
    private EntityManager entityManager;

    @Autowired
    public RankingDecisionService(IRankingDecisionRepository iRankingDecisionRepository, IEmployeeRepository iEmployeeRepository, ModelMapper modelMapper, IRankingGroupRepository iRankingGroupRepository, IDecisionCriteriaRepository iDecisionCriteriaRepository, IDecisionTasksRepository iDecisionTasksRepository, IRankingTitleRepository iRankingTitleRepository, IDecisionCriteriaService iDecisionCriteriaService, IDecisionCriteriaService iDecisionTasksService, IAccount iAccount, IRankingTitleOptionRepository iRankingTitleOptionRepository, IRankingTitleOptionService rankingTitleOptionService, ITaskWagesService taskWagesService, ITaskWagesRepository iTaskWagesRepository, EntityManager entityManager) {
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.iEmployeeRepository = iEmployeeRepository;
        this.modelMapper = modelMapper;
        this.iRankingGroupRepository = iRankingGroupRepository;
        this.iDecisionCriteriaRepository = iDecisionCriteriaRepository;
        this.iDecisionTasksRepository = iDecisionTasksRepository;
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.iDecisionCriteriaService = iDecisionCriteriaService;
        this.iDecisionTasksService = iDecisionTasksService;
        this.iAccount = iAccount;
        this.iRankingTitleOptionRepository = iRankingTitleOptionRepository;
        this.rankingTitleOptionService = rankingTitleOptionService;
        this.taskWagesService = taskWagesService;
        this.iTaskWagesRepository = iTaskWagesRepository;
        this.entityManager = entityManager;
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
        // Kiểm tra xem RankingDecision có tồn tại không trước khi xóa
        RankingDecision existingDecision = iRankingDecisionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ranking Decision not found with id: " + id));

        // Xóa các DecisionCriteria liên quan đến RankingDecision
        iDecisionCriteriaRepository.deleteByDecisionId(id);

        // Xóa các DecisionTasks liên quan đến RankingDecision
        iDecisionTasksRepository.deleteByDecisionId(id);

        // Xóa các RankingTitles liên quan đến RankingDecision
        List<RankingTitle> rankingTitles = iRankingTitleRepository.findByDecisionId(id);
        for (RankingTitle rankingTitle : rankingTitles) {
            int rankingTitleId = rankingTitle.getRankingTitleId();

            // Xóa các RankingTitleOption liên quan đến RankingTitle
            iRankingTitleOptionRepository.deleteByRankingTitleId(rankingTitleId);

            // Xóa các TaskWages liên quan đến RankingTitle
            iTaskWagesRepository.deleteByRankingTitleId(rankingTitleId);
// Gọi flush() để đồng bộ Session
            entityManager.flush();
            // Xóa RankingTitle
            iRankingTitleRepository.deleteById(rankingTitleId);
        }

        // Cuối cùng, xóa RankingDecision
        iRankingDecisionRepository.deleteById(id);
    }


    @Override
    public List<RankingDecisionResponse> getRankingDecisionResponses(List<RankingDecision> rankingDecisions) {
        // Convert a list of ranking decisions to DTO responses using ModelMapper
        List<RankingDecisionResponse> rankingDecisionResponses = new ArrayList<>();
        for (RankingDecision rankingDecision : rankingDecisions) {
            // Map basic fields using ModelMapper
            RankingDecisionResponse response = modelMapper.map(rankingDecision, RankingDecisionResponse.class);

            // Check if the status is "Finalized"
            if ("Finalized".equalsIgnoreCase(rankingDecision.getStatus())) {
                // Retrieve the finalizedByName from the Account repository
                Account accountOptional = iAccount.findById(rankingDecision.getFinalizedBy()).orElse(null);
                response.setFinalizedByName(accountOptional.getUsername());

            } else {
                // Do not set finalizedByName if status is not "Finalized"
                response.setFinalizedByName(null);
            }

            rankingDecisionResponses.add(response);
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
    public RankingDecision createRankingDecision(CreateRankingDecision form) {
        if (form.getDecisionToCloneId() != null) {
            /// clone
            // Find the original RankingDecision
            RankingDecision existingDecision = iRankingDecisionRepository.findById(form.getDecisionToCloneId())
                    .orElseThrow(() -> new RuntimeException("Ranking Decision not found!"));

            // Clone the RankingDecision
            RankingDecision cloneDecision = RankingDecision.builder()
                    .decisionName(form.getDecisionName())
                    .createdBy(form.getCreatedBy())
                    .status("Draft") // Default status
                    .build();
            cloneDecision = iRankingDecisionRepository.save(cloneDecision);  // Save cloneDecision to generate its ID

            // Clone Foreign Key 1-N or N-N relationships
//            cloneRankingGroups(existingDecision, cloneDecision, form.getCreatedBy());
            cloneDecisionCriteria(existingDecision, cloneDecision);
            cloneDecisionTasks(existingDecision, cloneDecision);
            cloneRankingTitles(existingDecision, cloneDecision);

            // Save and return the cloned decision with all associated entities
            return iRankingDecisionRepository.save(cloneDecision); // Ensure all entities are saved at once
        } else {
            /// add new
            // Create a new ranking decision entity from the form data
            RankingDecision decision = RankingDecision.builder()
                    .decisionName(form.getDecisionName())
                    .createdBy(form.getCreatedBy())
                    .status("Draft")// Set default status
                    .build();
            //Save
            return iRankingDecisionRepository.save(decision);
        }

    }

//    private void cloneRankingGroups(RankingDecision existingDecision, RankingDecision cloneDecision, Integer createdBy) {
//        if (existingDecision.getRankingGroups() != null) {
//            List<RankingGroup> clonedGroups = existingDecision.getRankingGroups().stream()
//                    .map(group -> {
//                        RankingGroup newGroup = new RankingGroup();
//                        newGroup.setGroupName(group.getGroupName());
//                        newGroup.setNumEmployees(group.getNumEmployees());
//                        newGroup.setCurrent_ranking_decision(cloneDecision.getDecisionId());
//                        newGroup.setCreatedBy(createdBy);
//                        return newGroup;
//                    }).collect(Collectors.toList());
//
//            // Save all ranking groups in one go
//            iRankingGroupRepository.saveAll(clonedGroups);
//            cloneDecision.setRankingGroups(clonedGroups);
//        }
//    }

    private void cloneDecisionCriteria(RankingDecision existingDecision, RankingDecision cloneDecision) {
        if (existingDecision.getDecisionCriteria() != null) {
            List<DecisionCriteria> clonedCriteriaList = existingDecision.getDecisionCriteria().stream()
                    .map(criteria -> {
                        DecisionCriteria newCriteria = new DecisionCriteria();
                        newCriteria.setDecisionId(cloneDecision.getDecisionId());
                        newCriteria.setCriteriaId(criteria.getCriteriaId());
                        newCriteria.setWeight(criteria.getWeight());
                        newCriteria.setCreatedAt(LocalDateTime.now());
                        return newCriteria;
                    }).collect(Collectors.toList());

            // Save all decision criteria in one go
            iDecisionCriteriaRepository.saveAll(clonedCriteriaList);
            cloneDecision.setDecisionCriteria(clonedCriteriaList);
        }
    }

    private void cloneDecisionTasks(RankingDecision existingDecision, RankingDecision cloneDecision) {
        if (existingDecision.getDecisionTasks() != null) {
            List<DecisionTasks> clonedTasks = existingDecision.getDecisionTasks().stream()
                    .map(task -> {
                        DecisionTasks newTask = new DecisionTasks();
                        newTask.setDecisionId(cloneDecision.getDecisionId());
                        newTask.setTaskId(task.getTaskId());
                        newTask.setCreatedAt(LocalDate.now());
                        return newTask;
                    }).collect(Collectors.toList());

            // Save all decision tasks in one go
            iDecisionTasksRepository.saveAll(clonedTasks);
            cloneDecision.setDecisionTasks(clonedTasks);
        }
    }

    @Transactional
    public void cloneRankingTitles(RankingDecision existingDecision, RankingDecision cloneDecision) {
        List<RankingTitle> existingTitles = existingDecision.getRankingTitles(); // Giả sử bạn có getter cho danh sách RankingTitles trong RankingDecision

        for (RankingTitle existingTitle : existingTitles) {
            // Clone RankingTitle
            RankingTitle clonedTitle = RankingTitle.builder()
                    .decisionId(cloneDecision.getDecisionId()) // Gán ID của quyết định mới
                    .titleName(existingTitle.getTitleName())
                    .totalScore(existingTitle.getTotalScore())
                    .createdAt(LocalDate.now())
                    .updatedAt(LocalDate.now())
                    .build();
            clonedTitle = iRankingTitleRepository.save(clonedTitle); // Lưu để lấy ID mới

            // Clone RankingTitleOption
            List<RankingTitleOption> existingOptions = existingTitle.getRankingTitleOptions();
            for (RankingTitleOption existingOption : existingOptions) {
                RankingTitleOption clonedOption = RankingTitleOption.builder()
                        .rankingTitleId(clonedTitle.getRankingTitleId()) // Gán ID của title mới
                        .optionId(existingOption.getOptionId())
                        .createdAt(LocalDate.now())
                        .updatedAt(LocalDate.now())
                        .build();
                iRankingTitleOptionRepository.save(clonedOption);
            }

            //clone TaskWage
            List<TaskWages> existTaskWages = existingTitle.getTaskWages();
            for (TaskWages existTaskWage : existTaskWages) {
                TaskWages clonedWages = TaskWages.builder()
                        .rankingTitleId(clonedTitle.getRankingTitleId())
                        .taskId(existTaskWage.getTaskId())
                        .workingHourWage(existTaskWage.getWorkingHourWage())
                        .overtimeWage(existTaskWage.getOvertimeWage())
                        .createdAt(LocalDate.now())
                        .updatedAt(LocalDate.now())
                        .build();
                iTaskWagesRepository.save(clonedWages);
            }
        }
    }


//    @Override
//    @Transactional
//    public RankingDecision cloneRankingDecision(AddCloneRankingDecisionRequest form) {
//        // Find the original RankingDecision
//        RankingDecision existingDecision = iRankingDecisionRepository.findById(form.getDecisionToCloneId())
//                .orElseThrow(() -> new RuntimeException("Ranking Decision not found!"));
//
//        // Clone the RankingDecision
//        RankingDecision cloneDecision = RankingDecision.builder()
//                .decisionName(form.getDecisionName())
//                .createdBy(form.getCreatedBy())
//                .status("Draft") // Default status
//                .build();
//        // Save cloneDecision to generate its ID
//        cloneDecision = iRankingDecisionRepository.save(cloneDecision);
//        ///clone Foreign Key 1-N
//        //Employee
//        if (existingDecision.getEmployees() != null) {
//            List<Employee> clonedEmployees = new ArrayList<>();
//            for (Employee employee : existingDecision.getEmployees()) {
//                Employee newEmployee = new Employee();
//                newEmployee.setEmployeeId(generateNewEmployeeId()); // Đảm bảo ID không bị trùng
//                newEmployee.setEmployeeName(employee.getEmployeeName());
//                newEmployee.setGroupId(employee.getGroupId());
//                newEmployee.setBulkImportId(employee.getBulkImportId());
//                newEmployee.setRankingDecisionId(cloneDecision.getDecisionId());
//                clonedEmployees.add(iEmployeeRepository.save(newEmployee)); // Lưu vào Persistence Context
//            }
//            cloneDecision.setEmployees(clonedEmployees);
//        }
//        // Clone Ranking Groups
//        if (existingDecision.getRankingGroups() != null) {
//            List<RankingGroup> cloneRankingGroups = new ArrayList<>();
//            for (RankingGroup rankingGroup : existingDecision.getRankingGroups()) {
//                RankingGroup newRankingGroup = new RankingGroup();
//                newRankingGroup.setGroupName(rankingGroup.getGroupName());
//                newRankingGroup.setNumEmployees(rankingGroup.getNumEmployees());
//                newRankingGroup.setCurrent_ranking_decision(rankingGroup.getCurrent_ranking_decision());
//                newRankingGroup.setCreatedBy(form.getCreatedBy());
//                cloneRankingGroups.add(iRankingGroupRepository.save(newRankingGroup)); // Save individually
//            }
//            cloneDecision.setRankingGroups(cloneRankingGroups);
//        }
//        // Clone DecisionCriteria (Bảng trung gian)
//        if (existingDecision.getDecisionCriteria() != null) {
//            List<DecisionCriteria> clonedCriteriaList = new ArrayList<>();
//            for (DecisionCriteria decisionCriteria : existingDecision.getDecisionCriteria()) {
//                DecisionCriteria newCriteria = new DecisionCriteria();
//                newCriteria.setDecisionId(cloneDecision.getDecisionId()); // Liên kết với RankingDecision đã clone
//                newCriteria.setCriteriaId(decisionCriteria.getCriteriaId()); // Sử dụng Criteria ID cũ
//                newCriteria.setWeight(decisionCriteria.getWeight()); // Clone weight
//                clonedCriteriaList.add(iDecisionCriteriaRepository.save(newCriteria)); // Save individually
//            }
//            cloneDecision.setDecisionCriteria(clonedCriteriaList); // Set cloned DecisionCriteria to the cloned RankingDecision
//        }
//
//        // Clone DecisionTask (Bảng trung gian)
//        if (existingDecision.getDecisionTasks() != null) {
//            List<DecisionTasks> clonedDecisionTasks = new ArrayList<>();
//            for (DecisionTasks decisionTasks : existingDecision.getDecisionTasks()) {
//                DecisionTasks newDecisionTask = new DecisionTasks();
//                newDecisionTask.setDecisionId(cloneDecision.getDecisionId());
//                newDecisionTask.setTaskId(decisionTasks.getTaskId());
//                clonedDecisionTasks.add(iDecisionTasksRepository.save(newDecisionTask));
//            }
//            cloneDecision.setDecisionTasks(clonedDecisionTasks);
//        }
//
//        // Clone Ranking Title
//        if (existingDecision.getRankingTitles() != null) {
//            List<RankingTitle> clonedRankingTitles = new ArrayList<>();
//            for (RankingTitle rankingTitle : existingDecision.getRankingTitles()) {
//                RankingTitle newRankingTitle = new RankingTitle();
//                newRankingTitle.setDecisionId(cloneDecision.getDecisionId());
//                newRankingTitle.setTitleName(rankingTitle.getTitleName());
//                newRankingTitle.setTotalScore(rankingTitle.getTotalScore());
//                clonedRankingTitles.add(iRankingTitleRepository.save(newRankingTitle));
//            }
//            cloneDecision.setRankingTitles(clonedRankingTitles);
//        }
//
//        return iRankingDecisionRepository.save(cloneDecision); // Save and return the cloned decision
//    }
//
//    private int generateNewEmployeeId() {
//        Integer maxId = iEmployeeRepository.findMaxId(); // Lấy ID lớn nhất
//        return (maxId == null ? 1 : maxId + 1); // Tạo ID mới không bị trùng
//    }

    @Override
    @Transactional
    public void updateRankingDecision(UpdateRankingDecision form, int decisionId) {
        // Find existing ranking decision by ID, throw an exception if not found
        RankingDecision decision = iRankingDecisionRepository.findById(decisionId).orElseThrow(() ->
                new EntityNotFoundException("Ranking decision not found with id: " + decisionId));
        if (!decision.getDecisionName().equals(form.getDecisionName())
                && iRankingDecisionRepository.existsByDecisionNameNot(form.getDecisionName())) {
            throw new RankingDecisionException("Ranking decision already exists with name: " + form.getDecisionName());
        }

        // Update decision name with the form data
        decision.setDecisionName(form.getDecisionName());

        //save
        iRankingDecisionRepository.saveAndFlush(decision);
    }

    @Override
    @Transactional
    public RankingDecision updateStatus(UpdateStatusRankingDecisionRequest form) {
        // Tìm kiếm RankingDecision
        RankingDecision decision = iRankingDecisionRepository.findById(form.getDecisionId()).orElseThrow(() ->
                new EntityNotFoundException("Ranking decision not found with id: " + form.getDecisionId()));

        // Lấy thông tin tài khoản từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName(); // Lấy tên người dùng từ SecurityContext
        Account account = (Account) iAccount.findByUsername(username).orElseThrow(() ->
                new EntityNotFoundException("Account not found with username: " + username));

        // Kiểm tra trạng thái bị cấm dựa trên vai trò
        String roleName = account.getRoleName() != null ? account.getRoleName().trim() : "";
        String status = form.getStatus().trim();
        System.out.println("RoleName: " + roleName + ", Status: " + status); // Debug
        if ("USER".equals(roleName)) {
            if (Arrays.asList("Confirmed", "Rejected", "Finalized").contains(status)) {
                throw new IllegalArgumentException("Role USER is not allowed to set status to: " + status);
            }
        } else if ("MANAGER".equals(roleName)) {
            if ("Finalized".equals(status)) {
                throw new IllegalArgumentException("Role MANAGER is not allowed to set status to: " + status);
            }
        } else if (!"ADMIN".equals(roleName)) {
            throw new IllegalArgumentException("Unknown role: " + roleName);
        }

        // Cập nhật trạng thái nếu hợp lệ
        decision.setStatus(status);
        return iRankingDecisionRepository.save(decision);
    }


    /// Valid
    @Override
    public boolean isRankingDecisionNameExist(String decisionName) {
        // Check if a ranking decision with the given name already exists
        return iRankingDecisionRepository.existsByDecisionName(decisionName);
    }

}
