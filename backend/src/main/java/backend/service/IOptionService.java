package backend.service;

import backend.model.dto.OptionResponse;
import backend.model.entity.Options;
import backend.model.form.Options.CreateOptionRequest;
import backend.model.form.Options.UpdateOptionRequest;
import org.hibernate.sql.Update;

import java.util.List;

public interface IOptionService {
    public List<Options> getAllOptions();
    public Options findOptionById(int id);
    public Options addOption(Options option);
    public Options updateOption(Options option);
    public void deleteOption(int id);
    public List<Options> findByCriteriaId(Integer criteriaId);

    // response
    public List<OptionResponse> getAllOptionResponses(List<Options> options);
    //request
    public void createOption(CreateOptionRequest form);
    public void updateOption(UpdateOptionRequest form, int optionId);
    //validate
    boolean existsByOptionName(String optionName);
}
