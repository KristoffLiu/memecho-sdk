import os

import requests
import openai

MEMECHO_API_BASE_URL = "https://api.memecho.cloud/api/v1"
headers = {"Content-Type": "application/json", "Authorization": f"Bearer {os.environ.get('MEMECHO_API_KEY')}"}


def prepare_memory(user_input: str, memory_lib_id: str):
    memory_query_request = requests.get(
        f"{MEMECHO_API_BASE_URL}/memory/query",
        json={
            "query": {"role": "user", "content": [{"type": "text", "text": user_input}]},
            "memory_lib_id": memory_lib_id,
            "read_only": False,
            "include_user_query": True,
            "require_raw_recall_message_id_list": False,
        },
        headers=headers,
    )
    memory = memory_query_request.json()
    messages = memory["ready_messages"]
    user_message_id = memory["message_id"]
    return messages, user_message_id


def append_assistant_message(memory_lib_id: str, llm_response: str) -> str:
    append_result_request = requests.post(
        f"{MEMECHO_API_BASE_URL}/memory/append-assistant-message",
        json={
            "assistant_message": {"role": "assistant", "content": [{"type": "text", "text": llm_response}]},
            "memory_lib_id": memory_lib_id,
        },
        headers=headers,
    )

    append_result_request.raise_for_status()
    append_result = append_result_request.json()
    assistant_message_id = append_result["message_id"]
    return assistant_message_id


def chat_with_llm(user_input: str, memory_lib_id: str, llm_client: openai.OpenAI, model: str) -> tuple[str, str, str]:
    # Prepare memory context
    messages, user_message_id = prepare_memory(user_input, memory_lib_id)

    # Chat with LLM
    response = llm_client.chat.completions.create(messages=messages, model=model)

    llm_response = response.choices[0].message.content

    # Append assistant message to memory
    assistant_message_id = append_assistant_message(memory_lib_id, llm_response)

    return llm_response, user_message_id, assistant_message_id
