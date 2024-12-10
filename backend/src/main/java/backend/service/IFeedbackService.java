package backend.service;

import backend.model.dto.FeedbackResponse;
import backend.model.entity.Feedback;
import backend.model.form.Feedback.upsertFeedBackRequest;

import java.util.List;

public interface IFeedbackService {
    public List<Feedback> getAllFeedback();
    public Feedback getFeedbackById(Integer id);
    public void deleteFeedbackById(Integer id);
    ///response
    public List<FeedbackResponse> getAllFeedbackResponses(List<Feedback> list);
    ///form
    public FeedbackResponse upsertFeedback(upsertFeedBackRequest form);
}
