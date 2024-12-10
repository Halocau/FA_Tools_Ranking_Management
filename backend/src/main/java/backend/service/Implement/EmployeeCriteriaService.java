package backend.service.Implement;

import backend.dao.*;
import backend.model.dto.ApplyCriteriaResponse;
import backend.model.dto.EmployeeCriteriaResponse;
import backend.model.dto.CaculatorCurrentRank;
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

    @Override
    public List<EmployeeCriteriaResponse> getEmployeeCriteriaResponse(List<EmployeeCriteria> listEmployeeCriteria) {
        if (listEmployeeCriteria == null || listEmployeeCriteria.isEmpty()) {
            throw new IllegalArgumentException("Employee criteria list cannot be null or empty.");
        }

        List<EmployeeCriteriaResponse> employeeCriteriaResponses = new ArrayList<>();
        Map<Integer, EmployeeCriteriaResponse> responseMap = new HashMap<>();

        for (EmployeeCriteria employeeCriteria : listEmployeeCriteria) {
            Employee employee = iEmployeeRepository.findById(employeeCriteria.getEmployeeId())
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeCriteria.getEmployeeId()));

            EmployeeCriteriaResponse response = responseMap.get(employeeCriteria.getEmployeeId());
            if (response == null) {
                response = new EmployeeCriteriaResponse();
                response.setEmployeeId(employee.getEmployeeId());
                response.setEmployeeName(employee.getEmployeeName());

                RankingGroup rankingGroup = irankingGroupRepository.findById(employee.getGroupId())
                        .orElseThrow(() -> new EntityNotFoundException("RankingGroup not found for group ID: " + employee.getGroupId()));
                response.setRankingGroupName(rankingGroup.getGroupName());

                RankingDecision rankingDecision = iRankingDecisionRepository.findByDecisionId(employee.getRankingDecisionId());
                if (rankingDecision == null) {
                    throw new EntityNotFoundException("RankingDecision not found for decision ID: " + employee.getRankingDecisionId());
                }
                response.setCurrentRankingDecision(rankingDecision.getDecisionName());

                responseMap.put(employee.getEmployeeId(), response);
            }

            List<ApplyCriteriaResponse> applyCriteriaList = new ArrayList<>();
            Set<String> criteriaSet = new HashSet<>();

            List<EmployeeCriteria> employeeCriteriaList = iEmployeeCriteriaRepository.findByEmployeeId(employee.getEmployeeId());
            for (EmployeeCriteria empCriteria : employeeCriteriaList) {
                Criteria criteria = iCriteriaRepository.findById(empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("Criteria not found for criteria ID: " + empCriteria.getCriteriaId()));

                Options option = iOptionRepository.findById(empCriteria.getOptionId())
                        .orElseThrow(() -> new EntityNotFoundException("Option not found for option ID: " + empCriteria.getOptionId()));

                DecisionCriteria decisionCriteria = iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(
                                employee.getRankingDecisionId(), empCriteria.getCriteriaId())
                        .orElseThrow(() -> new EntityNotFoundException("DecisionCriteria not found for decision ID: "
                                + employee.getRankingDecisionId() + " and criteria ID: " + empCriteria.getCriteriaId()));

                String uniqueKey = criteria.getCriteriaName() + "-" + option.getOptionName();
                if (!criteriaSet.contains(uniqueKey)) {
                    ApplyCriteriaResponse applyCriteriaResponse = new ApplyCriteriaResponse();
                    applyCriteriaResponse.setCriteriaName(criteria.getCriteriaName());
                    applyCriteriaResponse.setOptionName(option.getOptionName());
                    applyCriteriaResponse.setScore(option.getScore());
                    applyCriteriaResponse.setWeight(decisionCriteria.getWeight());
                    applyCriteriaResponse.setMaxScore(criteria.getMaxScore());
                    applyCriteriaList.add(applyCriteriaResponse);
                    criteriaSet.add(uniqueKey);
                }
            }

            response.setCriteriaList(applyCriteriaList);

            // Tính điểm tổng
            double totalScore = calculateTotalScore(applyCriteriaList);
            BigDecimal roundedTotalScore = new BigDecimal(totalScore).setScale(2, RoundingMode.HALF_UP);
            response.setTotalScore(roundedTotalScore.doubleValue());

            // Truy vấn danh sách RankingTitle theo decisionId và tìm totalScore gần nhất
            List<RankingTitle> rankingTitles = iRankingTitleRepository.findByDecisionIdOrderByTotalScoreAsc(employee.getRankingDecisionId());

            // Tìm rank gần nhất
            RankingTitle nearestRank = findNearestRank(roundedTotalScore.doubleValue(), rankingTitles);
            if (nearestRank != null) {
                response.setCurrentRank(nearestRank.getTitleName());
            }

            // Tìm rank tiếp theo (assessmentRank)
            RankingTitle nextRank = findNextRank(roundedTotalScore.doubleValue(), rankingTitles, nearestRank);
            if (nextRank != null) {
                response.setAssessmentRank(nextRank.getTitleName());  // Gán giá trị cho trường assessmentRank
            }

            responseMap.put(employee.getEmployeeId(), response);
        }

        employeeCriteriaResponses.addAll(responseMap.values());
        return employeeCriteriaResponses;
    }

    // Tính điểm tổng
    private double calculateTotalScore(List<ApplyCriteriaResponse> applyCriteriaList) {
        double totalScore = 0.0;
        for (ApplyCriteriaResponse criteria : applyCriteriaList) {
            totalScore += (criteria.getScore() * criteria.getWeight() / criteria.getMaxScore());
        }
        return totalScore;
    }

    // Lấy rank gần nhất
    private RankingTitle findNearestRank(double totalScore, List<RankingTitle> rankingTitles) {
        RankingTitle nearestRank = null;
        double minDifference = Double.POSITIVE_INFINITY;

        // Sắp xếp danh sách theo totalScore
        rankingTitles.sort(Comparator.comparingDouble(RankingTitle::getTotalScore));

        // Duyệt qua từng rank trong danh sách
        for (RankingTitle title : rankingTitles) {
            double titleTotalScore = title.getTotalScore();
            double difference = Math.abs(totalScore - titleTotalScore);

            // Kiểm tra sự khác biệt giữa totalScore và rank hiện tại
            if (difference < minDifference) {
                minDifference = difference;
                nearestRank = title;
            }

            // Nếu totalScore của rank đã vượt qua totalScore, dừng tìm kiếm
            if (titleTotalScore > totalScore) {
                break;
            }
        }

        return nearestRank;
    }

    // Tìm rank tiếp theo (assessmentRank)
    private RankingTitle findNextRank(double totalScore, List<RankingTitle> rankingTitles, RankingTitle currentRank) {
        RankingTitle nextRank = null;

        // Sắp xếp danh sách theo totalScore
        rankingTitles.sort(Comparator.comparingDouble(RankingTitle::getTotalScore));

        boolean foundCurrentRank = false;
        for (RankingTitle title : rankingTitles) {
            // Khi tìm thấy currentRank, bật cờ để bắt đầu tìm rank tiếp theo
            if (foundCurrentRank) {
                if (title.getTotalScore() > totalScore) {
                    nextRank = title;  // Rank tiếp theo có totalScore lớn hơn currentRank
                    break;
                }
            }

            // Đánh dấu đã tìm thấy currentRank
            if (title.getTitleName().equals(currentRank.getTitleName())) {
                foundCurrentRank = true;
            }
        }

        return nextRank;
    }


//    public String getCurrentRankForEmployee(int employeeId) {
//        // Lấy Employee
//        Employee employee = iEmployeeRepository.findById(employeeId)
//                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));
//
//        // Lấy danh sách EmployeeCriteria
//        List<EmployeeCriteria> employeeCriteriaList = iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
//        if (employeeCriteriaList.isEmpty()) {
//            throw new IllegalArgumentException("No criteria found for employee with ID: " + employeeId);
//        }
//
//        // Tạo danh sách ApplyCriteriaResponse từ EmployeeCriteria
//        List<ApplyCriteriaResponse> applyCriteriaList = new ArrayList<>();
//        for (EmployeeCriteria empCriteria : employeeCriteriaList) {
//            Criteria criteria = iCriteriaRepository.findById(empCriteria.getCriteriaId())
//                    .orElseThrow(() -> new EntityNotFoundException("Criteria not found for criteria ID: " + empCriteria.getCriteriaId()));
//
//            Options option = iOptionRepository.findById(empCriteria.getOptionId())
//                    .orElseThrow(() -> new EntityNotFoundException("Option not found for option ID: " + empCriteria.getOptionId()));
//
//            DecisionCriteria decisionCriteria = iDecisionCriteriaRepository.findByDecisionIdAndCriteriaId(
//                            employee.getRankingDecisionId(), empCriteria.getCriteriaId())
//                    .orElseThrow(() -> new EntityNotFoundException("DecisionCriteria not found for decision ID: "
//                            + employee.getRankingDecisionId() + " and criteria ID: " + empCriteria.getCriteriaId()));
//
//            ApplyCriteriaResponse applyCriteriaResponse = new ApplyCriteriaResponse();
//            applyCriteriaResponse.setCriteriaName(criteria.getCriteriaName());
//            applyCriteriaResponse.setOptionName(option.getOptionName());
//            applyCriteriaResponse.setScore(option.getScore());
//            applyCriteriaResponse.setWeight(decisionCriteria.getWeight());
//            applyCriteriaResponse.setMaxScore(criteria.getMaxScore());
//
//            applyCriteriaList.add(applyCriteriaResponse);
//        }
//
//        // Tính tổng điểm
//        double totalScore = calculateTotalScore(applyCriteriaList);
//        BigDecimal roundedTotalScore = new BigDecimal(totalScore).setScale(2, RoundingMode.HALF_UP);
//
//        // Lấy danh sách RankingTitle và tìm `currentRank`
//        List<RankingTitle> rankingTitles = iRankingTitleRepository.findByDecisionIdOrderByTotalScoreAsc(employee.getRankingDecisionId());
//        RankingTitle nearestRank = findNearestRank(roundedTotalScore.doubleValue(), rankingTitles);
//
//        // Trả về `currentRank`
//        return nearestRank != null ? nearestRank.getTitleName() : null;
//    }

    public String getCurrentRankForEmployee(int employeeId) {
        // Lấy Employee
        Employee employee = iEmployeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

        // Lấy danh sách ApplyCriteriaResponse từ truy vấn SQL
        List<CaculatorCurrentRank> applyCriteriaList = iEmployeeRepository.getApplyCriteriaResponsesForEmployee(employeeId);
        if (applyCriteriaList.isEmpty()) {
            throw new IllegalArgumentException("No criteria found for employee with ID: " + employeeId);
        }

        // Tính tổng điểm
        double totalScore = applyCriteriaList.stream()
                .mapToDouble(acr -> acr.getScore() * acr.getWeight())
                .sum();

        BigDecimal roundedTotalScore = new BigDecimal(totalScore).setScale(2, RoundingMode.HALF_UP);

        // Lấy danh sách RankingTitle và tìm `currentRank`
        List<RankingTitle> rankingTitles = iRankingTitleRepository.findByDecisionIdOrderByTotalScoreAsc(employee.getRankingDecisionId());
        RankingTitle nearestRank = findNearestRank(roundedTotalScore.doubleValue(), rankingTitles);

        // Trả về `currentRank`
        return nearestRank != null ? nearestRank.getTitleName() : null;
    }



}
