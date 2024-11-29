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

import java.math.BigDecimal;
import java.math.RoundingMode;

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
    private IDecisionCriteriaRepository iDecisionCriteriaRepository;

    @Autowired
    public EmployeeCriteriaService(IEmployeeCriteriaRepository iEmployeeCriteriaRepository, IEmployeeRepository iEmployeeRepository, ModelMapper modelMapper, IRankingTitleRepository iRankingTitleRepository, IBulkRankingHistoryRepository iBulkRankingHistoryRepository, IRankingGroupRepository irankingGroupRepository, IRankingDecisionRepository iRankingDecisionRepository, ICriteriaRepository iCriteriaRepository, IOptionRepository iOptionRepository, IDecisionCriteriaRepository iDecisionCriteriaRepository) {
        this.iEmployeeCriteriaRepository = iEmployeeCriteriaRepository;
        this.iEmployeeRepository = iEmployeeRepository;
        this.modelMapper = modelMapper;
        this.iRankingTitleRepository = iRankingTitleRepository;
        this.iBulkRankingHistoryRepository = iBulkRankingHistoryRepository;
        this.irankingGroupRepository = irankingGroupRepository;
        this.iRankingDecisionRepository = iRankingDecisionRepository;
        this.iCriteriaRepository = iCriteriaRepository;
        this.iOptionRepository = iOptionRepository;
        this.iDecisionCriteriaRepository = iDecisionCriteriaRepository;
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

    @Override
    public List<EmployeeCriteria> getEmployeeCriteriaByGroupId(Integer groupId) {
        return iEmployeeCriteriaRepository.findByGroupId(groupId);
    }

    // delete all
    @Override
    public void deleteByEmployeeId(Integer employeeId) {
        List<EmployeeCriteria> find = iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
        if (find == null) {
            throw new RuntimeException("Employee criteria list cannot be null or empty.");
        }
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

    /// Response
    @Override
    public List<EmployeeCriteriaResponse> getEmployeeCriteriaResponse(List<EmployeeCriteria> listEmployeeCriteria) {
        if (listEmployeeCriteria == null || listEmployeeCriteria.isEmpty()) {
            throw new IllegalArgumentException("Employee criteria list cannot be null or empty.");
        }

        List<EmployeeCriteriaResponse> employeeCriteriaResponses = new ArrayList<>();
        Map<Integer, EmployeeCriteriaResponse> responseMap = new HashMap<>();

        // Duyệt qua từng EmployeeCriteria trong danh sách
        for (EmployeeCriteria employeeCriteria : listEmployeeCriteria) {
            // Truy xuất thông tin nhân viên
            Employee employee = iEmployeeRepository.findById(employeeCriteria.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeCriteria.getEmployeeId()));

            // Kiểm tra xem đã có EmployeeCriteriaResponse chưa
            EmployeeCriteriaResponse response = responseMap.get(employeeCriteria.getEmployeeId());
            if (response == null) {
                // Chưa có, tạo mới
                response = new EmployeeCriteriaResponse();
                response.setEmployeeId(employee.getEmployeeId());
                response.setEmployeeName(employee.getEmployeeName());

                // Fetch RankingGroup
                RankingGroup rankingGroup = irankingGroupRepository.findById(employee.getGroupId())
                        .orElseThrow(() -> new EntityNotFoundException("RankingGroup not found for group ID: " + employee.getGroupId()));
                response.setRankingGroupName(rankingGroup.getGroupName());

                // Fetch RankingDecision
                RankingDecision rankingDecision = iRankingDecisionRepository.findByDecisionId(employee.getRankingDecisionId());
                if (rankingDecision == null) {
                    throw new EntityNotFoundException("RankingDecision not found for decision ID: " + employee.getRankingDecisionId());
                }
                response.setCurrentRankingDecision(rankingDecision.getDecisionName());

                // Fetch RankingTitle
                RankingTitle rankingTitle = iRankingTitleRepository.findById(employee.getRankingTitleId())
                        .orElseThrow(() -> new EntityNotFoundException("RankingTitle not found for title ID: " + employee.getRankingTitleId()));
                response.setCurrentRank(rankingTitle.getTitleName());

                responseMap.put(employee.getEmployeeId(), response);
            }

            // Lấy danh sách ApplyCriteriaResponse
            List<ApplyCriteriaResponse> applyCriteriaList = new ArrayList<>();
            Set<String> criteriaSet = new HashSet<>();

            // Lấy danh sách EmployeeCriteria của nhân viên
            List<EmployeeCriteria> employeeCriteriaList = iEmployeeCriteriaRepository.findByEmployeeId(employee.getEmployeeId());
            for (EmployeeCriteria empCriteria : employeeCriteriaList) {
                Criteria criteria = iCriteriaRepository.findById(empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("Criteria not found for criteria ID: " + empCriteria.getCriteriaId()));

                Options option = iOptionRepository.findById(empCriteria.getOptionId())
                        .orElseThrow(() -> new EntityNotFoundException("Option not found for option ID: " + empCriteria.getOptionId()));

                // Truy vấn để lấy weight từ DecisionCriteria
                DecisionCriteria decisionCriteria = iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(
                                employee.getRankingDecisionId(), empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("DecisionCriteria not found for decision ID: "
                                + employee.getRankingDecisionId() + " and criteria ID: " + empCriteria.getCriteriaId()));

                String uniqueKey = criteria.getCriteriaName() + "-" + option.getOptionName();
                if (!criteriaSet.contains(uniqueKey)) {
                    ApplyCriteriaResponse applyCriteriaResponse = new ApplyCriteriaResponse();
                    applyCriteriaResponse.setCirteriaName(criteria.getCriteriaName());
                    applyCriteriaResponse.setOptionName(option.getOptionName());
                    applyCriteriaResponse.setScore(option.getScore());
                    applyCriteriaResponse.setWeight(decisionCriteria.getWeight());
                    applyCriteriaResponse.setMaxScore(criteria.getMaxScore());
                    applyCriteriaList.add(applyCriteriaResponse);
                    criteriaSet.add(uniqueKey);
                }
            }

            response.setCriteriaList(applyCriteriaList);

            // Tính totalScore dựa trên criteriaList
            double totalScore = 0.0;
            for (ApplyCriteriaResponse criteria : applyCriteriaList) {
                totalScore += (criteria.getScore() * criteria.getWeight() / criteria.getMaxScore());
            }

            // Làm tròn totalScore thành 2 chữ số thập phân
            BigDecimal roundedTotalScore = new BigDecimal(totalScore).setScale(2, RoundingMode.HALF_UP);
            response.setTotalScore(roundedTotalScore.doubleValue());

            // Lấy danh sách RankingTitle sắp xếp theo totalScore
            List<RankingTitle> sortedRankingTitles = iRankingTitleRepository.findAllByOrderByTotalScoreAsc();

            // Truy xuất thông tin về thứ hạng hiện tại của Employee
            RankingTitle employeeRankingTitle = iRankingTitleRepository.findById(employee.getRankingTitleId())
                    .orElseThrow(() -> new EntityNotFoundException("RankingTitle not found for title ID: " + employee.getRankingTitleId()));

            // Mặc định assessmentRank là thứ hạng hiện tại
            String assessmentRank = employeeRankingTitle.getTitleName();

            // Duyệt danh sách để tìm thứ hạng phù hợp với totalScore
            for (RankingTitle title : sortedRankingTitles) {
                // Kiểm tra totalScore có null không trước khi gọi doubleValue
                double titleTotalScore = (title.getTotalScore() != null) ? title.getTotalScore() : 0.0;

                if (roundedTotalScore.doubleValue() >= titleTotalScore) {
                    assessmentRank = title.getTitleName(); // Cập nhật thứ hạng nếu đủ điểm
                } else {
                    break;
                }
            }

            response.setAssessmentRank(assessmentRank);
        }

        employeeCriteriaResponses.addAll(responseMap.values());
        return employeeCriteriaResponses;
    }


}
