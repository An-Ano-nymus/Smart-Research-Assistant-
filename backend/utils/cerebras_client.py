import os
from cerebras.cloud.sdk import Cerebras
# from dotenv import load_dotenv
# load_dotenv()


def LLM_ANS(user_prompt):
    API_KEY = os.environ.get("CEREBRAS_API_KEY", "csk-kjdnkhmmcrw4wfced48mjrjmpejewktm2392kx4k3vm2n56c")

    if not API_KEY:
        raise ValueError("Missing Cerebras API key. Please set the environment variable 'CEREBRAS_API_KEY'.")

    client = Cerebras(api_key=API_KEY)
    try:
        chat_completion = client.chat.completions.create(
            model="llama3.1-8b",
            messages=[{"role": "user", "content": user_prompt}],
        )
        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print("Error during Cerebras API call:", str(e))
        return "Error during LLM processing."
