package backend.controller;

import backend.model.dto.DecisionTasksResponse;
import backend.model.entity.DecisionTasks;
import backend.model.form.DecisionTasks.AddDecisionTasks;
import backend.service.IDecisionTasksService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/decision-task")
public class DecisionTasksController {
    private IDecisionTasksService iDecisionTasksService;

    @Autowired
    public DecisionTasksController(IDecisionTasksService iDecisionTasksService) {
        this.iDecisionTasksService = iDecisionTasksService;
    }

    @GetMapping("/{decisionId}")
    public ResponseEntity<List<DecisionTasksResponse>> getDecisionTasks(@PathVariable Integer decisionId) {
        List<DecisionTasksResponse> response = iDecisionTasksService.getDecisionTasksByDecisionId(decisionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addDecisionTasks(@Valid @RequestBody AddDecisionTasks form) {
        // check exits
        Optional<DecisionTasks> find = iDecisionTasksService.findByDecisionIdAndTaskId(form.getDecisionId(), form.getTaskId());
        if (find.isPresent()) {
            return new ResponseEntity<>("Decision Task already exists", HttpStatus.CONFLICT);  // Trả về lỗi nếu đã tồn tại
        }

        // Thêm mới task nếu chưa tồn tại
        iDecisionTasksService.addDecisionTasks(form, form.getDecisionId(), form.getTaskId());
        return new ResponseEntity<>("Decision Task added successfully", HttpStatus.CREATED);  // Mã trạng thái 201 (Created)
    }


    @PostMapping("/add-list")
    public ResponseEntity<String> addDecisionTasksList(@Valid @RequestBody List<AddDecisionTasks> forms) {
        if (forms == null || forms.isEmpty()) {
            return new ResponseEntity<>("The list of decision tasks cannot be empty", HttpStatus.BAD_REQUEST);
        }

        List<AddDecisionTasks> tasksToAdd = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        // Kiểm tra từng phần tử trong danh sách
        for (AddDecisionTasks form : forms) {
            Optional<DecisionTasks> find = iDecisionTasksService.findByDecisionIdAndTaskId(form.getDecisionId(), form.getTaskId());
            if (find.isPresent()) {
                // Nếu đã tồn tại, thêm vào danh sách lỗi hoặc bỏ qua
                errors.add("Decision Task with decisionId " + form.getDecisionId() + " and taskId " + form.getTaskId() + " already exists.");
            } else {
                tasksToAdd.add(form); // Thêm vào danh sách phần tử cần thêm
            }
        }

        // Nếu có phần tử cần thêm, thực hiện thêm vào cơ sở dữ liệu
        if (!tasksToAdd.isEmpty()) {
            iDecisionTasksService.addDecisionTasksList(tasksToAdd);
        }

        // Nếu có lỗi (phần tử trùng), trả về thông báo lỗi
        if (!errors.isEmpty()) {
            return new ResponseEntity<>("Some Decision Tasks already exist: " + String.join(", ", errors), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>("Decision Tasks list added successfully", HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{decisionId}/{taskId}")
    public ResponseEntity<String> deleteDecisionTasks(
            @PathVariable Integer decisionId,
            @PathVariable Integer taskId
    ) {
        iDecisionTasksService.deleteDecisionTask(decisionId, taskId);
        return new ResponseEntity<>("Decision task deleted successfully", HttpStatus.OK);
    }
}
