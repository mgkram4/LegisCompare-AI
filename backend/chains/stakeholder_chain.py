
from openai import OpenAI

from ..prompts import STAKEHOLDER_PROMPT


def get_stakeholder_analysis(bill_text: str, client: OpenAI) -> str:
    prompt = STAKEHOLDER_PROMPT + "\n\nLegislation: " + bill_text
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that analyzes stakeholders affected by legislation."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content or "" 