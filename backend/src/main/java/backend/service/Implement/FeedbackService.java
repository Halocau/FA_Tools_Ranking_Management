package backend.service.Implement;

import backend.dao.IAccount;
import backend.dao.IFeedbackRepository;
import backend.model.dto.FeedbackResponse;
import backend.model.entity.Account;
import backend.model.entity.Feedback;
import backend.model.form.Feedback.upsertFeedBackRequest;
import backend.service.IFeedbackService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackService implements IFeedbackService {
    private IFeedbackRepository iFeedbackRepository;
    private ModelMapper modelMapper;
    private IAccount iAccount;

    @Autowired
    public FeedbackService(IFeedbackRepository iFeedbackRepository, ModelMapper modelMapper, IAccount iAccount) {
        this.iFeedbackRepository = iFeedbackRepository;
        this.modelMapper = modelMapper;
        this.iAccount = iAccount;
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return iFeedbackRepository.findAll();
    }

    @Override
    public Feedback getFeedbackById(Integer id) {
        return iFeedbackRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Feedback not found for group ID: " + id));
    }

    @Override
    @Transactional
    public void deleteFeedbackById(Integer id) {
        Feedback feedback = getFeedbackById(id);
        if (feedback != null) {
            iFeedbackRepository.delete(feedback);
        }
    }

    @Override
    public List<FeedbackResponse> getAllFeedbackResponses(List<Feedback> list) {
        return list.stream()
                .map(feedback -> modelMapper.map(feedback, FeedbackResponse.class))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public FeedbackResponse upsertFeedback(upsertFeedBackRequest form) {
        // Lấy username từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = (Account) iAccount.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with username: " + username));
        Integer accountId = account.getId();

        // Kiểm tra dữ liệu đầu vào
        if (form.getNote() == null || form.getNote().trim().isEmpty()) {
            throw new IllegalArgumentException("Note cannot be null or empty.");
        }

        Feedback feedback;

        if (form.getDecisionId() != null) {
            // Kiểm tra nếu Feedback đã tồn tại với DecisionId
            feedback = iFeedbackRepository.findByDecisionId(form.getDecisionId())
                    .orElseGet(() -> new Feedback()); // Tạo mới nếu không tìm thấy
        } else {
            feedback = new Feedback();
        }

        // Cập nhật hoặc tạo mới Feedback
        feedback.setNote(form.getNote());
        feedback.setDecisionId(form.getDecisionId());
        feedback.setCreatedBy(accountId);

        // Lưu Feedback
        Feedback savedFeedback = iFeedbackRepository.save(feedback);

        // Trả về FeedbackResponse
        return FeedbackResponse.builder()
                .feedbackId(savedFeedback.getFeedbackId())
                .note(savedFeedback.getNote())
                .decisionId(savedFeedback.getDecisionId())
                .createdBy(savedFeedback.getCreatedBy())
                .build();
    }


}
