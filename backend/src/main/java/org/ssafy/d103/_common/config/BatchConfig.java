package org.ssafy.d103._common.config;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.ssafy.d103._common.batch.RankingFactories;
import org.ssafy.d103._common.batch.RankingProcessor;
import org.ssafy.d103._common.batch.ResetProcessor;
import org.ssafy.d103.communities.entity.photo.DailyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.MonthlyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;
import org.ssafy.d103.communities.entity.photo.WeeklyPhotoRanking;
import org.ssafy.d103.communities.service.PhotoRankingService;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final EntityManagerFactory entityManagerFactory;
    private final PhotoRankingService photoRankingService;

    @Bean
    public Job dailyRankingJob() {
        log.info("-----------------[ dailyRankingJob ]-----------------");
        return new JobBuilder("dailyRankingJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(dailyRankingStep())
                .build();
    }

    @Bean
    public Job weeklyRankingJob() {
        log.info("-----------------[ weeklyRankingJob ]-----------------");
        return new JobBuilder("weeklyRankingJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(weeklyRankingStep())
                .build();
    }

    @Bean
    public Job monthlyRankingJob() {
        log.info("-----------------[ monthlyRankingJob ]-----------------");
        return new JobBuilder("monthlyRankingJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(monthlyRankingStep())
                .build();
    }

    @Bean
    public Job dailyRankingAndResetJob() {
        log.info("-----------------[ dailyRankingAndResetJob ]-----------------");
        return new JobBuilder("dailyRankingAndResetJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(dailyRankingStep())
                .next(dailyResetStep())
                .build();
    }

    @Bean
    public Job weeklyRankingAndResetJob() {
        log.info("-----------------[ weeklyRankingAndResetJob ]-----------------");
        return new JobBuilder("weeklyRankingAndResetJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(weeklyRankingStep())
                .next(weeklyResetStep())
                .build();
    }

    @Bean
    public Job monthlyRankingAndResetJob() {
        log.info("-----------------[ monthlyRankingAndResetJob ]-----------------");
        return new JobBuilder("monthlyRankingAndResetJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(monthlyRankingStep())
                .next(monthlyResetStep())
                .build();
    }

    @Bean
    public Step dailyRankingStep() {
        log.info("=================* dailyRankingStep *=================");
        return new StepBuilder("dailyRankingStep", jobRepository)
                .<PhotoDetail, DailyPhotoRanking>chunk(10, transactionManager)
                .reader(dailyPhotoDetailItemReader())
                .processor(dailyRankingProcessor())
                .writer(dailyPhotoRankingItemWriter(dailyRankingProcessor()))
                .build();
    }

    @Bean
    public Step weeklyRankingStep() {
        log.info("=================* weeklyRankingStep *=================");
        return new StepBuilder("weeklyRankingStep", jobRepository)
                .<PhotoDetail, WeeklyPhotoRanking>chunk(10, transactionManager)
                .reader(weeklyPhotoDetailItemReader())
                .processor(weeklyRankingProcessor())
                .writer(weeklyPhotoRankingItemWriter(weeklyRankingProcessor()))
                .build();
    }

    @Bean
    public Step monthlyRankingStep() {
        log.info("=================* monthlyRankingStep *=================");
        return new StepBuilder("monthlyRankingStep", jobRepository)
                .<PhotoDetail, MonthlyPhotoRanking>chunk(10, transactionManager)
                .reader(monthlyPhotoDetailItemReader())
                .processor(monthlyRankingProcessor())
                .writer(monthlyPhotoRankingItemWriter(monthlyRankingProcessor()))
                .build();
    }

    @Bean
    public Step dailyResetStep() {
        log.info("=================* dailyResetStep *=================");
        return new StepBuilder("dailyResetStep", jobRepository)
                .<PhotoDetail, PhotoDetail>chunk(10, transactionManager)
                .reader(dailyPhotoDetailItemReader())
                .processor(new ResetProcessor(LocalDateTime.now(), ResetProcessor.ResetType.DAILY))
                .writer(photoDetailItemWriter())
                .build();
    }

    @Bean
    public Step weeklyResetStep() {
        log.info("=================* weeklyResetStep *=================");
        return new StepBuilder("weeklyResetStep", jobRepository)
                .<PhotoDetail, PhotoDetail>chunk(10, transactionManager)
                .reader(weeklyPhotoDetailItemReader())
                .processor(new ResetProcessor(LocalDateTime.now(), ResetProcessor.ResetType.WEEKLY))
                .writer(photoDetailItemWriter())
                .build();
    }

    @Bean
    public Step monthlyResetStep() {
        log.info("=================* monthlyResetStep *=================");
        return new StepBuilder("monthlyResetStep", jobRepository)
                .<PhotoDetail, PhotoDetail>chunk(10, transactionManager)
                .reader(monthlyPhotoDetailItemReader())
                .processor(new ResetProcessor(LocalDateTime.now(), ResetProcessor.ResetType.MONTHLY))
                .writer(photoDetailItemWriter())
                .build();
    }

    @Bean
    public JpaPagingItemReader<PhotoDetail> dailyPhotoDetailItemReader() {
        return new JpaPagingItemReaderBuilder<PhotoDetail>()
                .name("dailyPhotoDetailItemReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT p FROM PhotoDetail p WHERE p.dailyLikeUpdatedAt IS NOT NULL")
                .pageSize(100)
                .build();
    }

    @Bean
    public JpaPagingItemReader<PhotoDetail> weeklyPhotoDetailItemReader() {
        return new JpaPagingItemReaderBuilder<PhotoDetail>()
                .name("weeklyPhotoDetailItemReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT p FROM PhotoDetail p WHERE p.weeklyLikeUpdatedAt IS NOT NULL")
                .pageSize(100)
                .build();
    }

    @Bean
    public JpaPagingItemReader<PhotoDetail> monthlyPhotoDetailItemReader() {
        return new JpaPagingItemReaderBuilder<PhotoDetail>()
                .name("monthlyPhotoDetailItemReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT p FROM PhotoDetail p WHERE p.monthlyLikeUpdatedAt IS NOT NULL")
                .pageSize(100)
                .build();
    }

    @Bean
    public ItemWriter<PhotoDetail> photoDetailItemWriter() {
        JpaItemWriter<PhotoDetail> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }

    @Bean
    public ItemWriter<DailyPhotoRanking> dailyPhotoRankingItemWriter(RankingProcessor<DailyPhotoRanking> processor) {
        return items -> {
            List<DailyPhotoRanking> rankings = processor.getRankings();
            photoRankingService.saveDailyPhotoRankings(rankings);
        };
    }

    @Bean
    public ItemWriter<WeeklyPhotoRanking> weeklyPhotoRankingItemWriter(RankingProcessor<WeeklyPhotoRanking> processor) {
        return items -> {
            List<WeeklyPhotoRanking> rankings = processor.getRankings();
            photoRankingService.saveWeeklyPhotoRankings(rankings);
        };
    }

    @Bean
    public ItemWriter<MonthlyPhotoRanking> monthlyPhotoRankingItemWriter(RankingProcessor<MonthlyPhotoRanking> processor) {
        return items -> {
            List<MonthlyPhotoRanking> rankings = processor.getRankings();
            photoRankingService.saveMonthlyPhotoRankings(rankings);
        };
    }

    @Bean
    public RankingProcessor<DailyPhotoRanking> dailyRankingProcessor() {
        return new RankingProcessor<>(photoRankingService, RankingFactories.dailyPhotoRankingFactory(), "daily");
    }

    @Bean
    public RankingProcessor<WeeklyPhotoRanking> weeklyRankingProcessor() {
        return new RankingProcessor<>(photoRankingService, RankingFactories.weeklyPhotoRankingFactory(), "weekly");
    }

    @Bean
    public RankingProcessor<MonthlyPhotoRanking> monthlyRankingProcessor() {
        return new RankingProcessor<>(photoRankingService, RankingFactories.monthlyPhotoRankingFactory(), "monthly");
    }

}