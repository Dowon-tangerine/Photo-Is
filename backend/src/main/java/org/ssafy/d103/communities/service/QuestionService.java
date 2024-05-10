package org.ssafy.d103.communities.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.d103._common.exception.CustomException;
import org.ssafy.d103._common.exception.ErrorType;
import org.ssafy.d103._common.service.CommonService;
import org.ssafy.d103.communities.dto.PaginationDataDto;
import org.ssafy.d103.communities.dto.question.QuestionDto;
import org.ssafy.d103.communities.dto.question.request.DeleteQuestionCommentRequest;
import org.ssafy.d103.communities.dto.question.request.PostUploadQuestionRequest;
import org.ssafy.d103.communities.dto.question.request.PostWriteQuestionCommentRequest;
import org.ssafy.d103.communities.dto.question.request.PutModifyQuestionRequest;
import org.ssafy.d103.communities.dto.question.response.*;
import org.ssafy.d103.communities.entity.photo.Photo;
import org.ssafy.d103.communities.entity.question.*;
import org.ssafy.d103.communities.repository.photo.PhotoRepository;
import org.ssafy.d103.communities.repository.question.QuestionCommentRepository;
import org.ssafy.d103.communities.repository.question.QuestionDetailRepository;
import org.ssafy.d103.communities.repository.question.QuestionRepository;
import org.ssafy.d103.members.entity.Members;
import org.ssafy.d103.members.repository.MemberRepository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    private final QuestionDetailRepository questionDetailRepository;

    private final QuestionCommentRepository questionCommentRepository;

    private final PhotoRepository photoRepository;

    private final MemberRepository memberRepository;

    private final CommonService commonService;

    @Transactional
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

    public GetQuestionListResponse getQuestionList(int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 페이지네이션된 질문 데이터를 가져옴
        Page<Question> questionPage = questionRepository.findAll(pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (questionPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_QUESTION_PAGE);
        }

        // 각 질문을 QuestionDto로 변환
        List<QuestionDto> questions = questionPage.getContent().stream()
                .map(q -> QuestionDto.of(
                        q.getId(),
                        q.getMember().getId(),
                        q.getMember().getNickname(),
                        q.getCategory().getCategoryName(),
                        q.getTitle(),
                        q.getPhoto() != null,
                        q.getQuestionDetail().getCommentCnt(),
                        q.getQuestionDetail().getViewCnt(),
                        q.getCreatedAt()))
                .collect(Collectors.toList());

        // 데이터와 페이지네이션 정보를 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                questionPage.getNumber() + 1,
                questionPage.getTotalPages(),
                (int) questionPage.getTotalElements(),
                questionPage.getSize());

        // 전체 질문 수 및 질문 리스트 응답 생성
        return GetQuestionListResponse.of((int) questionPage.getTotalElements(), questions, paginationDataDto);
    }

    public GetQuestionListByCategoryResponse getQuestionListByCategory(String category, int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 카테고리별로 페이지네이션된 질문 데이터를 가져옴
        Page<Question> questionPage = questionRepository.findAllByCategory(Category.fromString(category), pageable);

        // 페이지에 데이터가 없을 경우 예외 발생
        if (questionPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_QUESTION_PAGE);
        }

        // 각 질문을 QuestionDto로 변환
        List<QuestionDto> questions = questionPage.getContent().stream()
                .map(q -> QuestionDto.of(
                        q.getId(),
                        q.getMember().getId(),
                        q.getMember().getNickname(),
                        q.getCategory().getCategoryName(),
                        q.getTitle(),
                        q.getPhoto() != null,
                        q.getQuestionDetail().getCommentCnt(),
                        q.getQuestionDetail().getViewCnt(),
                        q.getCreatedAt()))
                .collect(Collectors.toList());

        // 데이터와 페이지네이션 정보를 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                questionPage.getNumber() + 1,
                questionPage.getTotalPages(),
                (int) questionPage.getTotalElements(),
                questionPage.getSize());

        // 전체 질문 수 및 질문 리스트 응답 생성
        return GetQuestionListByCategoryResponse.of(category, (int) questionPage.getTotalElements(), questions, paginationDataDto);
    }

    public GetSearchQuestionResponse getSearchResultByFilter(String filter, String keyword, int page, int size) {
        Pageable pageable = createPageable(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Question> questionPage;

        // 필터별로 페이지네이션된 질문 데이터를 가져옴
        if (SearchFilter.fromString(filter).equals(SearchFilter.TITLE)) {
            questionPage = questionRepository.findAllByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword, pageable);
        } else if (SearchFilter.fromString(filter).equals(SearchFilter.AUTHOR)) {
            // 작성자의 닉네임이 포함된 질문 검색
            List<Members> authors = memberRepository.findByNicknameContainingIgnoreCase(keyword);

            if (authors.isEmpty()) {
                throw new CustomException(ErrorType.NOT_FOUND_AUTHOR);
            }

            // 작성자 목록의 모든 질문을 검색
            questionPage = questionRepository.findAllByMemberInOrderByCreatedAtDesc(authors, pageable);
        } else {
            throw new CustomException(ErrorType.BAD_REQUEST);
        }

        // 페이지에 데이터가 없을 경우 예외 발생
        if (questionPage.isEmpty()) {
            throw new CustomException(ErrorType.NOT_FOUND_SEARCH_RESULTS_PAGE);
        }

        // 각 질문을 QuestionDto로 변환
        List<QuestionDto> questions = questionPage.getContent().stream()
                .map(q -> QuestionDto.of(
                        q.getId(),
                        q.getMember().getId(),
                        q.getMember().getNickname(),
                        q.getCategory().getCategoryName(),
                        q.getTitle(),
                        q.getPhoto() != null,
                        q.getQuestionDetail().getCommentCnt(),
                        q.getQuestionDetail().getViewCnt(),
                        q.getCreatedAt()))
                .collect(Collectors.toList());

        // 데이터와 페이지네이션 정보를 구성
        PaginationDataDto paginationDataDto = PaginationDataDto.of(
                questionPage.getNumber() + 1,
                questionPage.getTotalPages(),
                (int) questionPage.getTotalElements(),
                questionPage.getSize());

        // 전체 질문 수 및 질문 리스트 응답 생성
        return GetSearchQuestionResponse.of(filter, (int) questionPage.getTotalElements(), questions, paginationDataDto);
    }

    private Pageable createPageable(int page, int size, Sort sort) {
        int adjustedPage = Math.max(page - 1, 0);
        return PageRequest.of(adjustedPage, size, sort);
    }

    @Transactional
    public GetQuestionDetailResponse getQuestionDetail(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        QuestionDetail questionDetail = questionDetailRepository.findByQuestion(question)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        questionDetail.updateViewCnt(true);

        return GetQuestionDetailResponse.from(question);
    }

    @Transactional
    public PutModifyQuestionResponse putModifyQuestion(Authentication authentication, Long questionId, PutModifyQuestionRequest putModifyQuestionRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Question question = questionRepository.findQuestionByIdAndMember(questionId, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        return PutModifyQuestionResponse.from(question.modifyQuestion(putModifyQuestionRequest.getTitle(), putModifyQuestionRequest.getContent()));
    }

    public DeleteQuestionResponse removeQuestion(Authentication authentication, Long questionId) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Question question = questionRepository.findQuestionByIdAndMember(questionId, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        try {
            questionRepository.delete(question);
        } catch (Exception e) {
            throw new CustomException(ErrorType.DB_DELETE_ERROR);
        }

        return DeleteQuestionResponse.of(true);
    }

    @Transactional
    public PostWriteQuestionCommentResponse writeQuestionComment(Authentication authentication, Long questionId, PostWriteQuestionCommentRequest postWriteQuestionCommentRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        questionCommentRepository.save(QuestionComment.of(postWriteQuestionCommentRequest.getComment(), member, question));

        QuestionDetail questionDetail = questionDetailRepository.findByQuestion(question)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        List<QuestionComment> questionCommentList = questionCommentRepository.findAllByQuestion(question);

        return PostWriteQuestionCommentResponse.of(questionDetail.updateCommentCnt(true), questionCommentList);
    }

    @Transactional
    public GetQuestionCommentListResponse getQuestionCommentList(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        QuestionDetail questionDetail = questionDetailRepository.findByQuestion(question)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        List<QuestionComment> questionCommentList = questionCommentRepository.findAllByQuestion(question);

        return GetQuestionCommentListResponse.of(questionDetail.getCommentCnt(), questionCommentList);
    }

    @Transactional
    public DeleteQuestionCommentResponse removeQuestionComment(Authentication authentication, Long questionId, DeleteQuestionCommentRequest deleteQuestionCommentRequest) {
        Members member = commonService.findMemberByAuthentication(authentication);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_QUESTION));

        QuestionDetail questionDetail = questionDetailRepository.findByQuestion(question)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_DETAIL));

        QuestionComment questionComment = questionCommentRepository.findByIdAndQuestionAndMember(deleteQuestionCommentRequest.getCommentId(), question, member)
                .orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_PHOTO_COMMENT));

        try {
            questionCommentRepository.delete(questionComment);
        } catch (Exception e) {
            e.getStackTrace();
            throw new CustomException(ErrorType.DB_DELETE_ERROR);
        }

        List<QuestionComment> questionCommentList = questionCommentRepository.findAllByQuestion(question);

        return DeleteQuestionCommentResponse.of(questionDetail.updateCommentCnt(false), questionCommentList);
    }
}