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

@Component
@Slf4j
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
        runJob(dailyRankingJob, "daily_ranking");
    }

    //    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 주간 랭킹 집계
    // runWeeklyRankingAndResetJob에서 집계와 초기화를 동시에 진행하기에 사용 X
    public void runWeeklyRankingJob() {
        log.info("*************** runWeeklyRankingJob ***************");
        weeklyRankingProcessor.initializeSortedItems();
        runJob(weeklyRankingJob, "weekly_ranking");
    }

    //    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 월간 랭킹 집계
    // runMonthlyRankingAndResetJob에서 집계와 초기화를 동시에 진행하기에 사용 X
    public void runMonthlyRankingJob() {
        log.info("*************** runMonthlyRankingJob ***************");
        monthlyRankingProcessor.initializeSortedItems();
        runJob(monthlyRankingJob, "monthly_ranking");
    }

    @Scheduled(cron = "0 */1 * * * *") // 매일 자정에 일간 랭킹 집계 및 초기화
    public void runDailyRankingAndResetJob() {
        log.info("*************** runDailyRankingAndResetJob ***************");
        dailyRankingProcessor.initializeSortedItems();
        runJob(dailyRankingAndResetJob, "daily_ranking_reset");
    }

    @Scheduled(cron = "0 */1 * * * *")
    public void runWeeklyRankingAndResetJob() {
        // 매주 월요일 자정에 주간 랭킹 집계 및 초기화
        if (isMonday()) {
            log.info("*************** runWeeklyRankingAndResetJob ***************");
            runJob(weeklyRankingAndResetJob, "weekly_ranking_reset");
        }
        // 매일 자정에 주간 랭킹 집계
        else {
            log.info("*************** runWeeklyRankingJob ***************");
            weeklyRankingProcessor.initializeSortedItems();
            runJob(weeklyRankingJob, "weekly_ranking");
        }
    }

    @Scheduled(cron = "0 */1 * * * *")
    public void runMonthlyRankingAndResetJob() {
        // 매월 1일 자정에 월간 랭킹 집계 및 초기화
        if (isFirstDayOfMonth()) {
            log.info("*************** runMonthlyRankingAndResetJob ***************");
            runJob(monthlyRankingAndResetJob, "monthly_ranking_reset");
        }
        // 매일 자정에 월간 랭킹 집계
        else {
            log.info("*************** runMonthlyRankingJob ***************");
            monthlyRankingProcessor.initializeSortedItems();
            runJob(monthlyRankingJob, "monthly_ranking");
        }
    }

    private void runJob(Job job, String jobName) {
        try {
            LocalDateTime now = LocalDateTime.now();
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