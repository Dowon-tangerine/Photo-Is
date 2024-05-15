package org.ssafy.d103._common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.job.builder.SimpleJobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.builder.TaskletStepBuilder;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;
import org.ssafy.d103.communities.service.PhotoRankingService;

@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final PhotoRankingService photoRankingService;

    @Bean
    public Job dailyRankingJob() {
        JobBuilder jobBuilder = new JobBuilder("dailyRankingJob", jobRepository);
        SimpleJobBuilder job = jobBuilder
                .incrementer(new RunIdIncrementer())
                .start(calculateDailyRankingsStep());
        return job.build();
    }

    @Bean
    public Job weeklyRankingJob() {
        JobBuilder jobBuilder = new JobBuilder("weeklyRankingJob", jobRepository);
        SimpleJobBuilder job = jobBuilder
                .incrementer(new RunIdIncrementer())
                .start(calculateWeeklyRankingsStep());
        return job.build();
    }

    @Bean
    public Job monthlyRankingJob() {
        JobBuilder jobBuilder = new JobBuilder("monthlyRankingJob", jobRepository);
        SimpleJobBuilder job = jobBuilder
                .incrementer(new RunIdIncrementer())
                .start(calculateMonthlyRankingsStep());
        return job.build();
    }

    @Bean
    public Step calculateDailyRankingsStep() {
        StepBuilder stepBuilder = new StepBuilder("calculateDailyRankingsStep", jobRepository);
        TaskletStepBuilder step = stepBuilder.tasklet((contribution, chunkContext) -> {
            photoRankingService.calculateDailyRankings();
            return RepeatStatus.FINISHED;
        }, transactionManager);
        return step.build();
    }

    @Bean
    public Step calculateWeeklyRankingsStep() {
        StepBuilder stepBuilder = new StepBuilder("calculateWeeklyRankingsStep", jobRepository);
        TaskletStepBuilder step = stepBuilder.tasklet((contribution, chunkContext) -> {
            photoRankingService.calculateWeeklyRankings();
            return RepeatStatus.FINISHED;
        }, transactionManager);
        return step.build();
    }

    @Bean
    public Step calculateMonthlyRankingsStep() {
        StepBuilder stepBuilder = new StepBuilder("calculateMonthlyRankingsStep", jobRepository);
        TaskletStepBuilder step = stepBuilder.tasklet((contribution, chunkContext) -> {
            photoRankingService.calculateMonthlyRankings();
            return RepeatStatus.FINISHED;
        }, transactionManager);
        return step.build();
    }
}
