# 베이스 이미지
FROM openjdk:17

# 컨테이너 외부와 컨테이너 내부를 연결시켜 저장된 데이터의 수명과 데이터를 생성한 컨테이너의 수명을 분리
VOLUME /tmp

# 외부 호스트 8081 포트로 노출
EXPOSE 8081

# 이미지 생성 시 파일 복사
COPY build/libs/*.jar application.jar

# 컨테이너의 어플 지정
CMD ["java", "-jar", "application.jar"]