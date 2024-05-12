from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import requests
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt
import uvicorn
from dotenv import load_dotenv
import os

app = FastAPI()

# 환경변수 파일 로드
load_dotenv()

# 환경변수 읽기
openai_api_key = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    question: str


# 간단한 챗봇 대화 구현
@app.post("/camera_chat")
async def camera_chat(request: ChatRequest):
    client = openai.OpenAI()
    try:
        # GPT-4 모델을 사용하여 챗봇 응답 생성
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "user",
                    "content": "You are a friendly camera expert. You enjoy teaching beginners about photography and cameras. You explain technical concepts in simple terms and provide detailed, practical advice. You are patient and never assume prior knowledge."
                },
                {
                   "role": "user",
                    "content": request.question
                }
            ],
            max_tokens=500  # 답변의 길이를 제한 (필요에 따라 조절 가능)
        )

        # API 응답으로 챗봇의 답변을 반환
        chat_response = response.choices[0].message.content if response.choices else "Sorry, I could not generate a response."
        return {"answer": chat_response}
    except Exception as e:
        # 예외 발생 시, HTTP 500 에러와 함께 오류 메시지 반환
        raise HTTPException(status_code=500, detail=str(e))

class ImageDescriptionRequest(BaseModel):
    image_url: str

# 이미지 설명
@app.post("/describe-image")
async def describe_image(request: ImageDescriptionRequest):
    client = openai.OpenAI()
    try:
        # GPT-4 Vision 모델에 설명 요청
        response = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """
                                You are a professional photo critic.
                                Please analyze the given photo to evaluate the expression, composition, composition, exposure, and focus, and evaluate each item out of 10.
                                Please start with a compliment and point out the shortcomings.
                                Looking at the picture, please write a note about your initial thoughts and suggestions, make a key list, and list them in the order they will be presented.
                                Please speak in a clear and concise language.
                                The technical factors are assessed as follows
                                1. Exposed
                                If the exposure does not look good, suggest varying the aperture or shutter speed
                                2. Focus
                                Please determine whether the type of photo is a landscape or a figure and evaluate whether the focus fits the factor well.
                                3. composition
                                Observe the visual weight of the photograph to see where the gaze goes first, compare this with the most interesting part of the photograph, and if the two areas do not go well, suggest a way for the photographer to show interesting visual weight
                                4. Color
                                Please check if the color temperature is right for the overall color harmony and atmosphere and if you need any advice.
                                5. Background
                                Check and suggest if the background fits the topic or is not too complicated.

                                All advice is in a soft tone that is not aggressive, but make sure you are adamant about what you need.                   """
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": request.image_url,
                                "detail": "low"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1000
        )

        # 이미지 다운로드 및 PIL로 처리
        download_img = requests.get(request.image_url)
        img = Image.open(BytesIO(download_img.content))

        # 이미지를 임시 파일로 저장하고, 이를 다시 클라이언트에게 보여주기 위해 URL 혹은 base64 인코딩 된 데이터를 반환할 수 있음
        # 여기서는 이미지를 출력하지 않고, 설명만 반환합니다.
        
        return {"description": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 프로그램의 시작점이면 run
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)





# import os
# from dotenv import load_dotenv

# load_dotenv()

# openai_api_key = os.environ.get("OPENAI_API_KEY")
# neo4j_url = os.environ.get("NEO4J_URL")
# neo4j_username = os.environ.get("NEO4J_USERNAME")
# neo4j_password = os.environ.get("NEO4J_PASSWORD")








# class Order(BaseModel):
#     product: str
#     units: int

# class Product(BaseModel):
#     name: str
#     notes: str

# @app.get("/ok")
# async def ok_endpoint():
#     return  {"message": "ok"}

# @app.get("/hello")
# async def hello_endpoint(name: str = 'World'):
#     return {"message": f"Hello, {name}!"}

# @app.post("/orders")
# async def place_order(product: str, units: int):
#     return {"message": f"Order for {units} units of {product} placed successfully."}

# @app.post("/orders_pydantic")
# async def place_order_pydantic(order:Order):
#     return {"message": f"Order for {order.units} units of {order.product} placed successfully."}

