# 📸 Photo Is 📸 
카메라 입문자들을 위한 카메라 학습 및 사진 공유 커뮤니티 서비스
<br>

<br>

## 기획 의도
최근 SNS의 활성화와 함께 고품격 사진에 대한 관심이 증가하고 있으며, 다양해지는 카메라와 스마트폰으로 디지털 사진의 접근성이 향상되고 있다. <br>
그러나 사진 입문자가 사진 촬영의 기초를 배운 뒤 실전에서 촬영에 적용해 보기까지는 많은 어려움이 존재한다. <br>
또한, 사진에 대한 이해 부족과 더불어 기술 발전에 따른 자동 보정 기능으로 인해 사진 커뮤니티 상의 사진들은 점차 개성을 잃고 획일화되고 있다. <br>
“Photo Is"는 이러한 문제를 해결하고자 사진 촬영의 기초부터 실습까지 쉽게 배울 수 있는 환경을 제공하며, 개개인의 사진 촬영 능력을 향상시키고 창의성을 발휘할 수 있도록 돕는다.

<br>

## 서비스 소개
Hello, CAMERA!
<br>
Hello, Photo Is!
<br>
사진의 기초부터, 실습한 사진 공유까지!

<br>

## 주요 기능
#### 1. AI 챗봇 : 
&nbsp;&nbsp;&nbsp;&nbsp; 카메라 및 사진과 관련된 자유로운 질문 가능
#### 2. 3D 카메라 모델링 : 
&nbsp;&nbsp;&nbsp;&nbsp; 카메라의 버튼 및 다이얼 등 구성 요소들을 살펴보며, 실제 장비 사용법을 쉽게 익힘
#### 3. 가상 촬영 시뮬레이션 스튜디오: 
&nbsp;&nbsp;&nbsp;&nbsp; 실제  촬영과 유사한 환경을 제공하여 촬영 모드, 조리개, 셔터스피드, 감도 등의 조절 값에 대한 체험 및 학습 가능
#### 4. 나만의 전시회 : 
&nbsp;&nbsp;&nbsp;&nbsp; 내가 찍은 사진을 직접 배치한 3D 전시회를 개최할 수 있고, 사용자들은 보다 몰입감 있는 작품 관람 가능
#### 5. 사진 공유 갤러리 : 
&nbsp;&nbsp;&nbsp;&nbsp; 자동 스케줄링을 통해 사진 좋아요의 일/주/월 증감량을 집계하여 사진들의 일간/주간/월간 랭킹을 제공 

<br>

## 프로젝트 정보
- 프로젝트명 : 삼성 청년 SW 아카데미(SSAFY) 10기 2학기 자율 프로젝트
- 기간 : 2024.04.08 ~ 2024.05.24

<br>

## 주요 기술 및 개발 환경
### Frontend
- Visual Studio Code
- HTML5, CSS3, Typescript, Tailwind
- React 18.2.0
- Vite 5.1.4
- Zustand
- three.js
- R3F

### Backend
- IntelliJ
- Java 17
- Spring Boot 3.2.1
  - Spring Security
  - Spring Data JPA
  - Spring Batch
- Gradle
- JWT
- OpenAI
- Fast API
- Redis
- Amazon RDS
- Amazon S3 Bucket Cloud
- MariaDB
- HeidiSQL

### Infra
- Amazon EC2
- Docker
- Docker Compose
- Jenkins
- Nginx

<br>

## 협업툴
- GitLab : 코드 버전 관리 및 MR과 리뷰
- Jira : 프로젝트 주차별 일정 관리 및 역할 분담
- Mattermost : 자료 및 진행 상황 공유
- Figma : Mockup, Wireframe, UI Design 작업
- Notion : 기획 및 개발 산출물 관리

<br>

## UCC 및 시연영상
- UCC : https://youtu.be/ATMvR24_iWM
- 시연영상 : https://youtu.be/wiT63j4eXmw

<br>

## 팀 소개
### D103 도원귤의🍊

<table border="1" style="width:100%; border-collapse: collapse;">
  <tr>
    <th style="text-align: center;">이름</th>
    <th style="text-align: center;">역할</th>
    <th style="text-align: center;">개발 내용</th>
  </tr>
  <tr>
    <td style="text-align: center;">김규리</td>
    <td style="text-align: center;">Frontend</td>
    <td>
      - 화면 설계<br>
      - 유저 페이지 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 마이페이지 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 마이페이지 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 마이페이지 내 사진 업로드 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 사진 업로드 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 마이페이지 내 팔로워 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 팔로워 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 다른 유저 페이지 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 다른 유저 페이지 API 연결<br>
      - Community 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- gallery 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- gallery 화면 랭킹 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- gallery 내 사진 상세 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- gallery 내 사진 상세 화면 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 화면 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 내 글작성 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 내 글작성 API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 내 글 상세보기 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 내 글 상세보기 API 연결<br>
      - Exhibition 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Exhibition 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Exhibition API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Exhibiton 개최 화면 구현<br>
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">김세현</td>
    <td style="text-align: center;">Backend<br>Frontend<br>Infra</td>
    <td>
      - DB 설계<br>
      - 프로젝트 초기 세팅<br>
      - Members 및 Follows API 구현<br>
      - 유저 페이지 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 내 정보 수정 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 내 정보 수정 API 연결<br>
      - Exhibition 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 3D 가상 전시회 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Exhibition API 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Exhibition 개최 API 연결<br>
      - UCC 제작
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">박창준</td>
    <td style="text-align: center;">Backend</td>
    <td>
      - DB 설계<br>
      - Python 백엔드 담당<br>
      - Docs 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Hello photo! 화면<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Docs API 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Dictionary 화면<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Dictionaries API 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- OpenAI API를 활용한 Chatbot 기능 구현
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">신시은</td>
    <td style="text-align: center;">Frontend</td>
    <td>
      - 화면 설계<br>
      - Studio 담당 <br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 튜토리얼 화면 구현 <br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 튜토리얼 프로세스 구현 <br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 바람개비 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 놀이동산 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 카메라 세팅 설정 구현 (iso, ss, aperture, ev)<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 카메라 사진 찍기 기능 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- 모의 사진 찍기 API 연결
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">이현직</td>
    <td style="text-align: center;">Frontend</td>
    <td>
      - 화면 설계<br>
      - Members 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Sign Up 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Sign In 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Members API 연결<br>
      - Docs 담당<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Hello Photo! 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Docs API 연결<br>
        &nbsp;&nbsp;&nbsp;&nbsp;- Dictionary 화면 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Three.js 기반 3D 카메라 모델링을 통한 용어 사전 기능 구현<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Dictionaries 및 Chatbots API 연결
    </td>
  </tr>
  <tr>
    <td style="text-align: center;">한채연</td>
    <td style="text-align: center;">Backend</td>
    <td>
      - DB 설계<br>
      - Community 담당<br>
      &nbsp;&nbsp;&nbsp;&nbsp;- Gallery 화면<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Photos API 구현<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Spring Batch를 활용한 랭킹 기능 구현<br>
      &nbsp;&nbsp;&nbsp;&nbsp;- Q&A 화면<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Questions API 구현
    </td>
  </tr>
</table>

<br>



## 서비스 화면
### Intro
![1](/.gitlab/readme_images/1.jpg)
<br>
### Sign Up
![2](/.gitlab/readme_images/2.jpg)
![3](/.gitlab/readme_images/3.jpg)
![4](/.gitlab/readme_images/4.jpg)
<br>
### Sign In
![5](/.gitlab/readme_images/5.jpg)

<br>

### Docs
#### 1. Hello Photo!
![6](/.gitlab/readme_images/6.jpg)

#### 2. Dictionary
![7](/.gitlab/readme_images/7.jpg)
<img src="/.gitlab/readme_images/8.gif" width="100%" style="display:inline-block"/>

#### 3. Chatbot
![9](/.gitlab/readme_images/9.jpg)

<br>

### Studio
![10](/.gitlab/readme_images/10.jpg)
<br>
#### 1. Tutorial
![11](/.gitlab/readme_images/11.jpg)
![12](/.gitlab/readme_images/12.jpg)
<img src="/.gitlab/readme_images/13.gif" width="100%"/>

#### 2. Free Mode
![14](/.gitlab/readme_images/14.jpg)
![15](/.gitlab/readme_images/15.jpg)
<img src="/.gitlab/readme_images/16.gif" width="100%"/>

<br>

### Community
#### 1. Gallery
![17](/.gitlab/readme_images/17.jpg)
![18](/.gitlab/readme_images/18.jpg)
![19](/.gitlab/readme_images/19.jpg)
![20](/.gitlab/readme_images/20.jpg)
![21](/.gitlab/readme_images/21.jpg)
<br>
#### 2. Q&A
![22](/.gitlab/readme_images/22.jpg)
![23](/.gitlab/readme_images/23.jpg)
![24](/.gitlab/readme_images/24.jpg)

<br>

### Exhibition
![25](/.gitlab/readme_images/25.jpg)
![26](/.gitlab/readme_images/26.jpg)
<img src="/.gitlab/readme_images/27.gif" width="100%"/>
![31](/.gitlab/readme_images/31.jpg)
![32](/.gitlab/readme_images/32.jpg)
![33](/.gitlab/readme_images/33.jpg)
<img src="/.gitlab/readme_images/34.gif" width="100%"/>

<br>

### My Page
![28](/.gitlab/readme_images/28.jpg)
<img src="/.gitlab/readme_images/29.gif" width="100%"/>
![30](/.gitlab/readme_images/30.jpg)

<br><br><br>


