package backend.controller;


import backend.config.exception.exceptionEntity.TaskException;
import backend.model.dto.OptionResponse;
import backend.model.entity.Options;
import backend.model.form.Options.CreateOptionRequest;
import backend.model.form.Options.UpdateOptionRequest;
import backend.service.IOptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/option")
public class OptionController {
    private IOptionService iOptionService;

    @Autowired
    public OptionController(IOptionService iOptionService) {
        this.iOptionService = iOptionService;
    }

    @GetMapping("/get/{id}")
    public List<OptionResponse> getAllOptions(@PathVariable(name = "id") Integer criteriaId) {
        List<Options> findByCriteriaId = iOptionService.findByCriteriaId(criteriaId);
        return iOptionService.getAllOptionResponses(findByCriteriaId);
    }

    @PostMapping("/add")
    public ResponseEntity<Object> createOptions(@RequestBody @Valid CreateOptionRequest form) {
        iOptionService.createOption(form);
        return ResponseEntity.ok("Option created successfully");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateOptions(@RequestBody @Valid UpdateOptionRequest form, @PathVariable(name = "id") Integer optionId) {
        iOptionService.updateOption(form, optionId);
        return ResponseEntity.ok("Option updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteOption(@PathVariable(name = "id") Integer optionId) {
        Options options = iOptionService.findOptionById(optionId);
        if (options == null) {
            throw new TaskException("Options not found for deletion");
        }
        iOptionService.deleteOption(optionId);
        return ResponseEntity.ok("Option deleted id " + optionId + " successfully");
    }
}
