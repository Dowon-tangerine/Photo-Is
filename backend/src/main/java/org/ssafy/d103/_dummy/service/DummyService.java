package org.ssafy.d103._dummy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.ssafy.d103._dummy.dto.DummyPhotos;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DummyService {

    @Value("${dummy.photos.photo-url}")
    private String[] thumbnailUrl;
    public List<DummyPhotos> selectPhotoList() {

        Random random = new Random();
        random.setSeed(System.currentTimeMillis());

        List<DummyPhotos> dummyPhotos = new ArrayList<>();
        for(int i=0; i<18; i++) {
            dummyPhotos.add(new DummyPhotos(
                    (long) i,
                    thumbnailUrl[random.nextInt(5)],
                    "사진 제목입니다 "+(i+1),
                    random.nextInt(100),
                    false));
        }
        return dummyPhotos;
    }
}
