package org.ssafy.d103.docs.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.ssafy.d103.docs.dto.CameraPartNameDto;
import org.ssafy.d103.docs.service.CameraPartService;
import org.ssafy.d103.docs.entity.CameraPart;

import java.util.List;
import java.util.Optional;
@Tag(name = "camera_parts", description = "카메라 부위 관련 API")
@RestController
@RequestMapping("/api/camera-parts")
@RequiredArgsConstructor
public class CameraPartController {

    private final CameraPartService cameraPartService;

    @Operation(summary = "카메라 부위 전체 조회",
            description = "카메라 부위 명칭과 ID, 생성 시간, 수정 시간을 반환합니다."
    )
    @GetMapping
    public List<CameraPartNameDto> getAllCameraParts() {
        return cameraPartService.getAllCameraParts();
    }

    @Operation(summary = "카메라 부위 상세 조회",
            description = "카메라 부위 명칭과 설명을 반환합니다."
    )
    @GetMapping("/{id}")
    public CameraPart getCameraPartById(@PathVariable Long id) {
        Optional<CameraPart> part = cameraPartService.getCameraPartById(id);
        return part.orElse(null);
    }

    @GetMapping("/search")
    public List<CameraPartNameDto> searchCameraPartsByName(@RequestParam String name) {
        return cameraPartService.findByName(name);
    }

//    @Operation(summary = "카메라 부위 생성",
//            description = "카메라 부위를 생성합니다."
//    )
//    @PostMapping
//    public CameraPart createCameraPart(@RequestBody CameraPart cameraPart) {
//        return cameraPartService.createCameraPart(cameraPart.getName(), cameraPart.getDescription());
//    }
//
//    @Operation(summary = "카메라 부위 업데이트",
//            description = "카메라 부위를 업데이트합니다."
//    )
//    @PutMapping("/{id}")
//    public CameraPart updateCameraPart(@PathVariable Long id, @RequestBody CameraPart cameraPart) {
//        return cameraPartService.updateCameraPart(id, cameraPart.getName(), cameraPart.getDescription());
//    }
//
//    @Operation(summary = "카메라 부위 삭제",
//            description = "카메라 부위를 삭제합니다."
//    )
//    @DeleteMapping("/{id}")
//    public void deleteCameraPart(@PathVariable Long id) {
//        cameraPartService.deleteCameraPart(id);
//    }
}