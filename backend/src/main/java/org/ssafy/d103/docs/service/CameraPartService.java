package org.ssafy.d103.docs.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.d103.docs.dto.CameraPartNameDto;
import org.ssafy.d103.docs.entity.CameraPart;
import org.ssafy.d103.docs.repository.CameraPartRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CameraPartService {

    private CameraPartRepository cameraPartRepository;

    public List<CameraPartNameDto> getAllCameraParts() {
        return cameraPartRepository.findAll().stream()
                .map(part -> new CameraPartNameDto(
                        part.getId(),
                        part.getName(),
                        part.getCreatedAt(),
                        part.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<CameraPart> getCameraPartById(Long id) {
        return cameraPartRepository.findById(id);
    }

    public CameraPart createCameraPart(String name, String description) {
        CameraPart cameraPart = new CameraPart(name, description, LocalDateTime.now(), LocalDateTime.now());
        return cameraPartRepository.save(cameraPart);
    }

    public CameraPart updateCameraPart(Long id, String name, String description) {
        Optional<CameraPart> optionalCameraPart = cameraPartRepository.findById(id);
        if (optionalCameraPart.isPresent()) {
            CameraPart cameraPart = optionalCameraPart.get();
            cameraPart.setName(name);
            cameraPart.setDescription(description);
            cameraPart.setUpdatedAt(LocalDateTime.now());
            return cameraPartRepository.save(cameraPart);
        } else {
            throw new RuntimeException("Camera part not found");
        }
    }

    public void deleteCameraPart(Long id) {
        cameraPartRepository.deleteById(id);
    }
}
