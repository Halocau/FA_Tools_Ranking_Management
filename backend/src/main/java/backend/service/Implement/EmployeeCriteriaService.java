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

    /// RESPONSE
    @Override
    public List<EmployeeCriteriaResponse> getEmployeeCriteriaResponse(List<EmployeeCriteria> listEmployeeCriteria) {
        List<EmployeeCriteriaResponse> employeeCriteriaResponses = new ArrayList<>();
        Map<Integer, EmployeeCriteriaResponse> responseMap = new HashMap<>();

        for (EmployeeCriteria employeeCriteria : listEmployeeCriteria) {
            // Kiểm tra xem EmployeeCriteriaResponse đã được tạo cho employeeId này chưa
            EmployeeCriteriaResponse response = responseMap.get(employeeCriteria.getEmployeeId());
            if (response == null) {
                // Nếu chưa, khởi tạo EmployeeCriteriaResponse
                response = new EmployeeCriteriaResponse();
                Optional<Employee> findEmployee = iEmployeeRepository.findById(employeeCriteria.getEmployeeId());
                if (findEmployee.isPresent()) {
                    Employee employee = findEmployee.get();
                    response.setEmployeeId(employee.getEmployeeId());
                    response.setEmployeeName(employee.getEmployeeName());

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

                    // Thêm response vào map
                    responseMap.put(employee.getEmployeeId(), response);
                }
            }

            // Xử lý criteriaList, đảm bảo không lặp
            List<EmployeeCriteria> employeeCriteriaList = iEmployeeCriteriaRepository.findByEmployeeId(employeeCriteria.getEmployeeId());
            Set<String> criteriaSet = new HashSet<>(); // Set để kiểm tra trùng lặp
            List<ApplyCriteriaResponse> applyCriteriaList = new ArrayList<>();

            for (EmployeeCriteria empCriteria : employeeCriteriaList) {
                Criteria criteria = iCriteriaRepository.findById(empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("Criteria not found for criteria ID: " + empCriteria.getCriteriaId()));

                Options option = iOptionRepository.findById(empCriteria.getOptionId())
                        .orElseThrow(() -> new EntityNotFoundException("Option not found for option ID: " + empCriteria.getOptionId()));

                // Tạo chuỗi định danh duy nhất cho criteria + option để kiểm tra trùng lặp
                String uniqueKey = criteria.getCriteriaName() + "-" + option.getOptionName();
                if (!criteriaSet.contains(uniqueKey)) {
                    ApplyCriteriaResponse applyCriteriaResponse = new ApplyCriteriaResponse();
                    applyCriteriaResponse.setCirteriaName(criteria.getCriteriaName());
                    applyCriteriaResponse.setOptionName(option.getOptionName());

                    applyCriteriaList.add(applyCriteriaResponse);
                    criteriaSet.add(uniqueKey); // Đánh dấu là đã xử lý
                }
            }

            // Gán danh sách criteriaList không trùng lặp vào response
            response.setCriteriaList(applyCriteriaList);
        }

        // Trả về danh sách EmployeeCriteriaResponse từ map
        employeeCriteriaResponses.addAll(responseMap.values());
        return employeeCriteriaResponses;
    }

}
