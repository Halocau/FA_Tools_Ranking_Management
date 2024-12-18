package backend.controller;

import backend.model.entity.TaskWages;
import backend.model.form.TasksWage.UpsertTasksWage;
import backend.service.ITaskWagesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/tasks-wage")
public class TasksWageController {
    private ITaskWagesService iTaskWagesService;

    @Autowired
    public TasksWageController(ITaskWagesService iTaskWagesService) {
        this.iTaskWagesService = iTaskWagesService;
    }

    @GetMapping
    public ResponseEntity<List<TaskWages>> getAllTasksWages() {
        List<TaskWages> getAll = iTaskWagesService.getTaskWages();
        return new ResponseEntity<>(getAll, HttpStatus.OK);
    }

    @PutMapping("/upsert")
    public ResponseEntity<String> updateTaskWages(@Valid @RequestBody UpsertTasksWage form) {
        Optional<TaskWages> find = iTaskWagesService.findByRankingTitleIdAndTaskId(form.getRankingTitleId(), form.getTaskId());
        iTaskWagesService.upsertTaskWages(form, form.getRankingTitleId(), form.getTaskId());
        return new ResponseEntity<>("Task wages updated successfully", HttpStatus.OK);
    }

    @PutMapping("/upsert-list")
    public ResponseEntity<String> upsertTaskWagesList(@Valid @RequestBody List<UpsertTasksWage> forms) {
        iTaskWagesService.upsertTaskWagesList(forms);
        return new ResponseEntity<>("Task wages updated successfully for all items", HttpStatus.OK);
    }

    @DeleteMapping("delete/{rankingTitleId}/{taskId}")
    public ResponseEntity<String> deleteTaskWages(
            @PathVariable(name = "rankingTitleId") Integer rankingTitleId,
            @PathVariable(name = "taskId") Integer taskId) {
        iTaskWagesService.deleteTaskWages(rankingTitleId, taskId);
        return new ResponseEntity<>("Task wages deleted successfully", HttpStatus.OK);
    }


    @DeleteMapping("delete-wages/{rankingTitleId}")
    public ResponseEntity<String> deleteTaskWagesByRankingTitleId(
            @PathVariable(name = "rankingTitleId") Integer rankingTitleId){
        iTaskWagesService.deleteTaskWagesByRankingTitleId(rankingTitleId);
        return new ResponseEntity<>("Task wages deleted successfully", HttpStatus.OK);
    }
}
