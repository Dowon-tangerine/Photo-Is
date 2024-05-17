package org.ssafy.d103._common.batch;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.ssafy.d103.communities.entity.photo.DailyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.MonthlyPhotoRanking;
import org.ssafy.d103.communities.entity.photo.WeeklyPhotoRanking;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
public class RankingScheduler {

    private final JobLauncher jobLauncher;
    private final Job dailyRankingJob;
    private final Job weeklyRankingJob;
    private final Job monthlyRankingJob;
    private final Job dailyRankingAndResetJob;
    private final Job weeklyRankingAndResetJob;
    private final Job monthlyRankingAndResetJob;
    private final RankingProcessor<DailyPhotoRanking> dailyRankingProcessor;
    private final RankingProcessor<WeeklyPhotoRanking> weeklyRankingProcessor;
    private final RankingProcessor<MonthlyPhotoRanking> monthlyRankingProcessor;

    public RankingScheduler(JobLauncher jobLauncher,
                            @Qualifier("dailyRankingJob") Job dailyRankingJob,
                            @Qualifier("weeklyRankingJob") Job weeklyRankingJob,
                            @Qualifier("monthlyRankingJob") Job monthlyRankingJob,
                            @Qualifier("dailyRankingAndResetJob") Job dailyRankingAndResetJob,
                            @Qualifier("weeklyRankingAndResetJob") Job weeklyRankingAndResetJob,
                            @Qualifier("monthlyRankingAndResetJob") Job monthlyRankingAndResetJob,
                            RankingProcessor<DailyPhotoRanking> dailyRankingProcessor,
                            RankingProcessor<WeeklyPhotoRanking> weeklyRankingProcessor,
                            RankingProcessor<MonthlyPhotoRanking> monthlyRankingProcessor) {
        this.jobLauncher = jobLauncher;
        this.dailyRankingJob = dailyRankingJob;
        this.weeklyRankingJob = weeklyRankingJob;
        this.monthlyRankingJob = monthlyRankingJob;
        this.dailyRankingAndResetJob = dailyRankingAndResetJob;
        this.weeklyRankingAndResetJob = weeklyRankingAndResetJob;
        this.monthlyRankingAndResetJob = monthlyRankingAndResetJob;
        this.dailyRankingProcessor = dailyRankingProcessor;
        this.weeklyRankingProcessor = weeklyRankingProcessor;
        this.monthlyRankingProcessor = monthlyRankingProcessor;
    }

    //    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 일간 랭킹 집계
    // runDailyRankingAndResetJob에서 집계와 초기화를 동시에 진행하기에 사용 X
    public void runDailyRankingJob() {
        log.info("*************** runDailyRankingJob ***************");
        dailyRankingProcessor.initializeSortedItems();
        runJobWithTime(dailyRankingJob, "daily_ranking", LocalDateTime.now());
    }

    //    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 주간 랭킹 집계
    // runWeeklyRankingAndResetJob에서 집계와 초기화를 동시에 진행하기에 사용 X
    public void runWeeklyRankingJob() {
        log.info("*************** runWeeklyRankingJob ***************");
        weeklyRankingProcessor.initializeSortedItems();
        runJobWithTime(weeklyRankingJob, "weekly_ranking", LocalDateTime.now());
    }

    //    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 월간 랭킹 집계
    // runMonthlyRankingAndResetJob에서 집계와 초기화를 동시에 진행하기에 사용 X
    public void runMonthlyRankingJob() {
        log.info("*************** runMonthlyRankingJob ***************");
        monthlyRankingProcessor.initializeSortedItems();
        runJobWithTime(monthlyRankingJob, "monthly_ranking", LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void runDailyRankingAndResetJob() {
        // 매일 자정에 일간 랭킹 집계 및 초기화
        log.info("*************** runDailyRankingAndResetJob ***************");
        dailyRankingProcessor.initializeSortedItems();
        runJobWithTime(dailyRankingAndResetJob, "daily_ranking_reset", LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void runWeeklyRankingAndResetJob() {
        weeklyRankingProcessor.initializeSortedItems();

        // 매주 월요일 자정에 주간 랭킹 집계 및 초기화
        if (isMonday()) {
            log.info("*************** runWeeklyRankingAndResetJob ***************");
            runJobWithTime(weeklyRankingAndResetJob, "weekly_ranking_reset", LocalDateTime.now());
        }
        // 매일 자정에 주간 랭킹 집계
        else {
            log.info("*************** runWeeklyRankingJob ***************");
            runJobWithTime(weeklyRankingJob, "weekly_ranking", LocalDateTime.now());
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void runMonthlyRankingAndResetJob() {
        monthlyRankingProcessor.initializeSortedItems();

        // 매월 1일 자정에 월간 랭킹 집계 및 초기화
        if (isFirstDayOfMonth()) {
            log.info("*************** runMonthlyRankingAndResetJob ***************");
            runJobWithTime(monthlyRankingAndResetJob, "monthly_ranking_reset", LocalDateTime.now());
        }
        // 매일 자정에 월간 랭킹 집계
        else {
            log.info("*************** runMonthlyRankingJob ***************");
            runJobWithTime(monthlyRankingJob, "monthly_ranking", LocalDateTime.now());
        }
    }

    private void runJobWithTime(Job job, String jobName, LocalDateTime now) {
        try {
            String formattedNow = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

            log.info("Running {} job", jobName);
            jobLauncher.run(job, new JobParametersBuilder()
                    .addString("now", now.toString())
                    .addString("run.id", formattedNow + "_" + jobName)
                    .toJobParameters());
        } catch (Exception e) {
            log.error("Error running {} job", jobName, e);
        }
    }

    private boolean isMonday() {
        return LocalDateTime.now().getDayOfWeek() == DayOfWeek.MONDAY;
    }

    private boolean isFirstDayOfMonth() {
        return LocalDateTime.now().getDayOfMonth() == 1;
    }

}