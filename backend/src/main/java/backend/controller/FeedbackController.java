package backend.controller;

import backend.model.dto.FeedbackResponse;
import backend.model.entity.Feedback;
import backend.model.form.Feedback.upsertFeedBackRequest;
import backend.service.IFeedbackService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/feedback")
public class FeedbackController {
    private final ModelMapper modelMapper;
    private IFeedbackService iFeedbackService;

    @Autowired
    public FeedbackController(IFeedbackService iFeedbackService, ModelMapper modelMapper) {
        this.iFeedbackService = iFeedbackService;
        this.modelMapper = modelMapper;
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        // Lấy danh sách Feedback
        List<Feedback> feedbackList = iFeedbackService.getAllFeedback();

        // Kiểm tra nếu danh sách rỗng
        if (feedbackList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }

        // Chuyển đổi danh sách Feedback sang FeedbackResponse
        List<FeedbackResponse> feedbackResponseList = iFeedbackService.getAllFeedbackResponses(feedbackList);

        // Trả về danh sách FeedbackResponse với mã trạng thái OK
        return ResponseEntity.ok(feedbackResponseList);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<FeedbackResponse> findFeedback(@PathVariable Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("id must not be null");
        }
        Optional<Feedback> find = iFeedbackService.findByDecisionId(id);
        FeedbackResponse response = modelMapper.map(find.get(), FeedbackResponse.class);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/upsert")
    public ResponseEntity<FeedbackResponse> upsertFeedback(@RequestBody @Valid upsertFeedBackRequest form) {
        FeedbackResponse feedbackResponse = iFeedbackService.upsertFeedback(form);
        //return response
        return new ResponseEntity<>(feedbackResponse, HttpStatus.OK);
    }


    @DeleteMapping("/delete/{feedbackId}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Integer feedbackId) {
        iFeedbackService.deleteFeedbackById(feedbackId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
