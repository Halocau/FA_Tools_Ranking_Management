package backend.service;

import backend.model.dto.FeedbackResponse;
import backend.model.entity.Feedback;
import backend.model.form.Feedback.upsertFeedBackRequest;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;

public interface IFeedbackService {
    public List<Feedback> getAllFeedback();
    public Feedback getFeedbackById(Integer id);
    public void deleteFeedbackById(Integer id);
    Optional<Feedback> findByDecisionId(Integer decisionId);
    ///response
    public List<FeedbackResponse> getAllFeedbackResponses(List<Feedback> list);
    ///form
    public FeedbackResponse upsertFeedback(upsertFeedBackRequest form);
}
