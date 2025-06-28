# prompts.py

def get_hint_prompt(code: str, hint_type: str) -> str:
    base_instruction = (
        "The coding problem is described in the comment block at the top of the code. "
        "The code written below the comment is the user's attempt at solving the problem. "
        "If there is no code present, say 'No code shown.' "
    )

    if hint_type == "weak":
        return (
            f"{base_instruction}\n\nCode:\n\n{code}\n\n"
            "Tell the user whether they are on the right track. "
            "Give a vague or gentle hint or suggestion to improve their code, limited to one paragraph. "
            "Avoid giving a full solution or detailed steps. "
            "Do NOT include any greetings, acknowledgments, or phrases like 'I'm happy to help.' "
            "Do NOT comment on time complexity."
        )

    elif hint_type == "strong":
        return (
            f"{base_instruction}\n\nCode:\n\n{code}\n\n"
            "Tell the user whether they are on the right track. "
            "Give a very detailed or strong hint to guide them in the correct direction, in one paragraph. "
            "You may include comments about time or space complexity. "
            "Do NOT give a full solution. "
            "Avoid greetings or acknowledgment phrases."
        )

    else:
        raise ValueError("Invalid hint type")



def get_question_prompt(difficulty: str, company: str, topic: str) -> str:
    if company == "Any Company" and topic == "Random Question":
        return f"Generate a {difficulty} coding interview question."

    elif company != "Any Company" and topic == "Random Question":
        return f"Generate a {difficulty} coding interview question asked by {company}."

    elif company == "Any Company" and topic != "Random Question":
        return f"Generate a {difficulty} {topic} coding interview question."

    else: 
        return f"Generate a {difficulty} {topic} coding interview question asked by {company}."
