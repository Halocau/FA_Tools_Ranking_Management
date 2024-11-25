package backend.service;

import backend.model.dto.EmployeeCriteriaResponse;
import backend.model.entity.EmployeeCriteria;
import backend.model.form.EmployeeCriteria.UpsertEmployeeCriteriaRequest;

import java.util.List;

public interface IEmployeeCriteriaService {
    /// crud
    public List<EmployeeCriteria> getEmployeeCriteria();

    //find
    EmployeeCriteria findByEmployeeIdAndCriteriaId(Integer employeeId, Integer criteriaId);

    List<EmployeeCriteria> findByEmployeeId(Integer employeeId);

    //delete
    void deleteByEmployeeId(Integer employeeId);

    ///  form
    public void upsertEmployeeCriteria(UpsertEmployeeCriteriaRequest form, Integer employeeId, Integer criteriaId);

    public void upsertEmployeeCriteriaList(List<UpsertEmployeeCriteriaRequest> forms);

    /// response
    public List<EmployeeCriteriaResponse> getEmployeeCriteriaResponse(List<EmployeeCriteria> listEmployeeCriteria);
}
