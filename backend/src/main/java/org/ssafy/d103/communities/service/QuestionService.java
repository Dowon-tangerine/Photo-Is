package org.ssafy.d103.communities.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.dto.question.request.PostUploadQuestionRequest;
import org.ssafy.d103.communities.dto.question.response.PostUploadQuestionResponse;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.question.Category;
import org.ssafy.d103.communities.entity.question.Question;
import org.ssafy.d103.communities.entity.question.QuestionDetail;
import org.ssafy.d103.communities.repository.photo.PhotoRepository;
import org.ssafy.d103.communities.repository.question.QuestionDetailRepository;
import org.ssafy.d103.communities.repository.question.QuestionRepository;
import org.ssafy.d103.members.entity.Members;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    private final QuestionDetailRepository questionDetailRepository;

    private final PhotoRepository photoRepository;

    private final CommonService commonService;

    public PostUploadQuestionResponse uploadQuestion(Authentication authentication, PostUploadQuestionRequest postUploadQuestionRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        // 질문에 사진을 포함한 경우
        if (postUploadQuestionRequest.getPhotoId() != null) {
            Photo photo = photoRepository.findPhotoByIdAndMember(postUploadQuestionRequest.getPhotoId(), member)
                    .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO));

            try {
                Question question = questionRepository.save(Question.of(postUploadQuestionRequest.getTitle(), postUploadQuestionRequest.getContent(),
                        Category.fromString(postUploadQuestionRequest.getCategory()), member, photo));

                questionDetailRepository.save(QuestionDetail.init(question));

                return PostUploadQuestionResponse.of(true);
            } catch (Exception e) {
                e.getStackTrace();
                throw new CustomException(ErrorType.DB_SAVE_ERROR);
            }
        }
        // 질문에 사진을 포함하지 않은 경우
        else {
            try {
                Question question = questionRepository.save(Question.of(postUploadQuestionRequest.getTitle(), postUploadQuestionRequest.getContent(),
                        Category.fromString(postUploadQuestionRequest.getCategory()), member));

                questionDetailRepository.save(QuestionDetail.init(question));

                return PostUploadQuestionResponse.of(true);
            } catch (Exception e) {
                e.getStackTrace();
                throw new CustomException(ErrorType.DB_SAVE_ERROR);
            }
        }
    }
}