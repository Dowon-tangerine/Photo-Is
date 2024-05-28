package org.ssafy.d103._common.batch;

import org.springframework.batch.item.ItemProcessor;
import org.ssafy.d103.communities.entity.photo.PhotoDetail;

import java.time.LocalDateTime;

public class ResetProcessor implements ItemProcessor<PhotoDetail, PhotoDetail> {

    public enum ResetType {
        DAILY, WEEKLY, MONTHLY
    }

    private final LocalDateTime now;
    private final ResetType resetType;

    public ResetProcessor(LocalDateTime now, ResetType resetType) {
        this.now = now;
        this.resetType = resetType;
    }

    @Override
    public PhotoDetail process(PhotoDetail item) {
        if (item != null) {
            switch (resetType) {
                case DAILY:
                    item.resetDailyLikeCnt(now);
                    break;
                case WEEKLY:
                    item.resetWeeklyLikeCnt(now);
                    break;
                case MONTHLY:
                    item.resetMonthlyLikeCnt(now);
                    break;
            }
        }
        return item;
    }

}