package org.ssafy.d103._common.batch;

import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RankingScheduler {

    private final JobLauncher jobLauncher;
    private final Job dailyRankingJob;
    private final Job weeklyRankingJob;
    private final Job monthlyRankingJob;

    public RankingScheduler(JobLauncher jobLauncher, Job dailyRankingJob, Job weeklyRankingJob, Job monthlyRankingJob) {
        this.jobLauncher = jobLauncher;
        this.dailyRankingJob = dailyRankingJob;
        this.weeklyRankingJob = weeklyRankingJob;
        this.monthlyRankingJob = monthlyRankingJob;
    }

//    @Scheduled(cron = "0 0 0 * * *") // 매일 자정에 실행
    @Scheduled(cron = "0 0 5 * * *") // 테스트
    public void runDailyRankingJob() {
        try {
            log.info("Running daily ranking job");
            jobLauncher.run(dailyRankingJob, new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters());
        } catch (Exception e) {
            log.error("Error running daily ranking job", e);
        }
    }

    @Scheduled(cron = "0 0 0 * * SUN") // 매주 일요일 자정에 실행
    public void runWeeklyRankingJob() {
        try {
            log.info("Running weekly ranking job");
            jobLauncher.run(weeklyRankingJob, new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters());
        } catch (Exception e) {
            log.error("Error running weekly ranking job", e);
        }
    }

    @Scheduled(cron = "0 0 0 1 * *") // 매월 1일 자정에 실행
    public void runMonthlyRankingJob() {
        try {
            log.info("Running monthly ranking job");
            jobLauncher.run(monthlyRankingJob, new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters());
        } catch (Exception e) {
            log.error("Error running monthly ranking job", e);
        }
    }
}