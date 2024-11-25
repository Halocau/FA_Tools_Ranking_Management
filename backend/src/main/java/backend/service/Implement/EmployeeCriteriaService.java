package backend.service.Implement;

import backend.dao.IEmployeeCriteriaRepository;
import backend.model.entity.EmployeeCriteria;
import backend.model.form.EmployeeCriteria.UpsertEmployeeCriteriaRequest;
import backend.service.IEmployeeCriteriaService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeCriteriaService implements IEmployeeCriteriaService {
    private IEmployeeCriteriaRepository iEmployeeCriteriaRepository;

    @Autowired
    public EmployeeCriteriaService(IEmployeeCriteriaRepository iEmployeeCriteriaRepository) {
        this.iEmployeeCriteriaRepository = iEmployeeCriteriaRepository;
    }

    @Override
    public EmployeeCriteria findByEmployeeIdAndCriteriaId(Integer employeeId, Integer criteriaId) {
        return iEmployeeCriteriaRepository.findByEmployeeIdAndCriteriaId(employeeId, criteriaId);
    }
    /// find list id
    @Override
    public List<EmployeeCriteria> findByEmployeeId(Integer employeeId) {
        return iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
    }

    /// delete all
    @Override
    public void deleteByEmployeeId(Integer employeeId) {
        List<EmployeeCriteria> find = iEmployeeCriteriaRepository.findByEmployeeId(employeeId);
        iEmployeeCriteriaRepository.deleteAll(find);
    }

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
        for (UpsertEmployeeCriteriaRequest form : forms) {
            upsertEmployeeCriteria(form, form.getEmployeeId(), form.getCriteriaId());
        }
    }
}
