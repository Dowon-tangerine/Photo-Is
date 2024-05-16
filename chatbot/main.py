from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import openai
import requests
from PIL import Image
from io import BytesIO
import uvicorn
from dotenv import load_dotenv
import os
import logging

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

class ChatMessageDto(BaseModel):
    role: str
    message: str

class ChatSessionRequestDto(BaseModel):
    question: str
    messages: List[ChatMessageDto]

class ChatResponseDto(BaseModel):
    answer: str

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 간단한 챗봇 대화 구현
@app.post("/api/py/chat", response_model=ChatResponseDto)
async def chat(request: ChatSessionRequestDto):
    client = openai.OpenAI()
    try:
        logger.debug("Received request: %s", request.json())

        # 프롬프트와 이전 대화기록을 포함한 질문
        formatted_messages = [
            {"role": "system", "content": (
                "You are a kind camera expert.\n"
                "The questioner is a beginner who is new to photography and cameras.\n"
                "Explain complex camera concepts in simple terms. Give examples if necessary.\n"
                "Please answer all the answers in Korean."
            )}
        ]
        
        formatted_messages += [{"role": msg.role, "content": msg.message} for msg in request.messages]
        formatted_messages.append({"role": "user", "content": request.question})

        logger.debug("Formatted messages: %s", formatted_messages)

        # GPT-4o 모델을 사용하여 챗봇 응답 생성
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=formatted_messages,
            max_tokens=1000,  # 응답의 최대 토큰 수
        )

        # API 응답으로 챗봇의 답변을 반환
        chat_response = response.choices[0].message.content if response.choices else "Sorry, I could not generate a response."
        return ChatResponseDto(chat_response)
    except Exception as e:
        # 예외 발생 시, HTTP 500 에러와 함께 오류 메시지 반환
        logger.error("Exception: %s", str(e))
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

class TagResponse(BaseModel):
    tags: list

@app.post("/api/py/generate-tags", response_model=TagResponse)
async def generate_tags(request: ImageTagRequest):
    client = openai.OpenAI()
    try:
        # 이미지를 GPT-4o 모델을 사용하여 설명하도록 요청
        description_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Describe the contents of the following image in detail"
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
            max_tokens=100,  # 응답의 최대 토큰 수
        )
        
        description = description_response.choices[0].message.content

        tag_prompt = f"Based on the following description, generate a list of appropriate tags in bullet points, one tag per line, for korean word not sentence:" 
        
        tag_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                            {
                                "type": "text",
                                "text": tag_prompt + "\n" + description
                            },
                        ],
                }  
            ],
            max_tokens=50,
        )

        tags_text = tag_response.choices[0].message.content.strip()
        tags = [tag.strip('- ').strip() for tag in tags_text.split('\n') if tag.startswith('-')]
        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# 프로그램의 시작점이면 run
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=9001)
