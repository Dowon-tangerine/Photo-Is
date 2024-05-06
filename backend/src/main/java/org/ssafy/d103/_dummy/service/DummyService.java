package org.ssafy.d103._dummy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.ssafy.d103._dummy.dto.DummyPhotos;

import java.util.ArrayList;
import java.util.List;

@Service
public class DummyService {

    @Value("${dummy.photos.photo-url}")
    String thumbnailUrl;
    public List<DummyPhotos> selectPhotoList() {

        List<DummyPhotos> dummyPhotos = new ArrayList<>();
        for(int i=0; i<18; i++) {
            dummyPhotos.add(new DummyPhotos(
                    (long) i,
                    thumbnailUrl,
                    "사진 제목입니다.",
                    0,
                    false));
        }
        return dummyPhotos;
    }
}
