from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import requests
from PIL import Image
from io import BytesIO
import uvicorn
from dotenv import load_dotenv
import os

app = FastAPI()

# 환경변수 파일 로드
load_dotenv()

# 환경변수 읽기
openai_api_key = os.getenv("OPENAI_API_KEY")

# CORS 설정 추가
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

# 간단한 챗봇 대화 구현
@app.post("/api/py/camera-chat")
async def camera_chat(request: ChatRequest):
    client = openai.OpenAI()
    try:
        # GPT-4o 모델을 사용하여 챗봇 응답 생성
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    # 사용자 역할을 좀 더 명확하게 설정하여 효율적인 질문 응답을 도모
                    "content": 
                    """
                        You are a kind camera expert.
                        The questioner is a beginner who is new to photography and cameras.
                        Explain complex camera concepts in simple terms. Give examples if necessary.
                        Please answer all the answers in Korean.
                    """
                },
                {
                    "role": "user",
                    "content": request.question  # 사용자의 질문
                }
            ],
            max_tokens=1000,  # 응답의 최대 토큰 수
        )

        # API 응답으로 챗봇의 답변을 반환
        chat_response = response.choices[0].message.content if response.choices else "Sorry, I could not generate a response."
        return {"answer": chat_response}
    except Exception as e:
        # 예외 발생 시, HTTP 500 에러와 함께 오류 메시지 반환
        raise HTTPException(status_code=500, detail=str(e))

class ImageDescriptionRequest(BaseModel):
    image_url: str

# 이미지 비평
@app.post("/api/py/describe-image")
async def describe_image(request: ImageDescriptionRequest):
    client = openai.OpenAI()
    try:
        # GPT-4o 모델에 설명 요청
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
                                You are a professional photo critic.
                                Take a deep breath given and analyze the picture step by step.
                                The questioner is probably a beginner who is new to photography.
                                but don't say directly they are beginner.
                                Please start with compliments and point out the shortcomings.
                                The technical factors are assessed as follows
                                1. Exposed
                                2. Focus
                                3. composition
                                Observe the visual weight of the picture to see where the gaze goes first, and suggest a way for the photographer to show interesting visual weight if the two areas do not match well compared to the most interesting parts of the picture
                                4. Color
                                Please check if the color temperature is suitable for the overall color tone and atmosphere and if you need any advice.
                                5. Background
                                Check and suggest if the background fits the topic or is not too complicated.

                                All advice is not aggressive, but you have to be firm about what you need.
                                Please change your answer to Korean.         
                                """
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": request.image_url,  # 요청받은 이미지 URL
                                "detail": "low"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000,  # 응답의 최대 토큰 수
        )

        # 이미지 다운로드 및 PIL로 처리
        download_img = requests.get(request.image_url)
        img = Image.open(BytesIO(download_img.content))

        # 이미지를 임시 파일로 저장하고, 이를 다시 클라이언트에게 보여주기 위해 URL 혹은 base64 인코딩 된 데이터를 반환할 수 있음
        # 여기서는 이미지를 출력하지 않고, 설명만 반환합니다.
        
        return {"description": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ImageTagRequest(BaseModel):
    image_url: str

# 태그 자동 생성
@app.post("/api/py/generate-tags")
async def generate_tags(request: ImageTagRequest):
    try:
        # 이미지 다운로드
        response = requests.get(request.image_url)
        image = Image.open(BytesIO(response.content))
        
        # 이미지를 GPT-4o에게 설명하도록 요청
        image_description_prompt = f"Describe the contents of the following image in detail: {request.image_url}"
        
        description_response = openai.Completion.create(
            engine="gpt-4o",
            prompt=image_description_prompt,
            max_tokens=100,
        )
        
        description = description_response.choices[0].text.strip()
        
        # 설명을 바탕으로 태그를 추출하도록 GPT-4o에게 요청
        tag_prompt = f"Based on the following description, generate appropriate tags: {description}"
        
        tag_response = openai.Completion.create(
            engine="gpt-4o",
            prompt=tag_prompt,
            max_tokens=50,
        )
        
        tags = tag_response.choices[0].text.strip().split(', ')
        
        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 프로그램의 시작점이면 run
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=9001)