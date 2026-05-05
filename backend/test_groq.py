import os
from dotenv import load_dotenv
load_dotenv()
from langchain_groq import ChatGroq
llm = ChatGroq(api_key=os.getenv('GROQ_API_KEY'), model_name='llama-3.3-70b-versatile')
res = llm.invoke('Say hello in one word')
print(res.content)