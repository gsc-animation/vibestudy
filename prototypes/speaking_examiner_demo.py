import json
import sys

# --- Mock Data (Simulating JSON_Units from DB) ---
MOCK_DB = {
    "unit_y3_sci_forces": {
        "title": "Forces and Magnets",
        "learning_objects": [
            "Understand that forces can be pushes or pulls",
            "Identify magnetic materials",
            "Describe how magnets interact (attract/repel)"
        ],
        "vocabulary": [
            "Force", "Magnet", "Pole", "Attract", "Repel", "Friction", "Surface"
        ],
        "grammar_focus": [
            "Comparatives (The magnet is stronger than...)",
            "Cause and effect (It moved because...)"
        ],
        "sample_qa": [
            {"q": "What happens when you put two north poles together?", "a": "They repel each other."}
        ]
    },
    "unit_y3_sci_plants": {
        "title": "Plants and Photosynthesis",
        "learning_objects": [
            "Identify parts of a plant",
            "Explain what plants need to grow"
        ],
        "vocabulary": [
            "Root", "Stem", "Leaf", "Flower", "Sunlight", "Water", "Soil"
        ],
        "grammar_focus": [
            "Present Simple for facts (Plants need water.)",
            "Prepositions of place (The roots are under the ground.)"
        ]
    }
}

def get_units(unit_ids):
    """Fetches unit data from the mock DB."""
    return [MOCK_DB[uid] for uid in unit_ids if uid in MOCK_DB]

def build_meta_prompt(selected_units):
    """
    Constructs the prompt that would be sent to the System's LLM (e.g., GPT-4/Gemini)
    to generate the final 'Teacher Persona' prompt for the user.
    """
    
    # Aggregating content
    topics = []
    vocab_list = []
    grammar_list = []
    objectives = []
    
    for unit in selected_units:
        topics.append(unit['title'])
        vocab_list.extend(unit['vocabulary'])
        grammar_list.extend(unit.get('grammar_focus', []))
        objectives.extend(unit['learning_objects'])
        
    # The Prompt Template
    # This is what we send to OUR backend LLM to ask it to write the script.
    meta_prompt = f"""
    You are an expert Educational Prompt Engineer.
    
    Your task is to generate a comprehensive 'System Instruction' for a conversational AI (like ChatGPT Live or Gemini Live) to act as a Cambridge Primary Examiner for a Grade 3 student.
    
    The student has studied the following topics: {", ".join(topics)}.
    
    TARGET CONTENT:
    - Vocabulary to test: {", ".join(vocab_list)}
    - Grammar to enforce: {", ".join(grammar_list)}
    - Learning Objectives: {"; ".join(objectives)}
    
    INSTRUCTIONS FOR THE OUTPUT PROMPT:
    1. Role: Act as 'Teacher Sarah', a friendly but professional examiner.
    2. Format: Spoken conversation.
    3. Procedure:
       - Start by greeting the student warmly.
       - Ask open-ended questions related to the Learning Objectives.
       - If the student makes a grammar mistake (specifically from the list), gently correct them and ask them to repeat.
       - If the student uses a target vocabulary word correctly, praise them.
       - After 5-10 minutes (or 5 questions), conclude the session.
       - PROVIDE A SUMMARY at the end: Give a score (1-5 stars) on Fluency, Vocabulary, and Accuracy, and list 3 specific tips for improvement.
    
    Output ONLY the System Instruction text that the user should copy-paste.
    """
    
    return meta_prompt

def simulate_llm_call(prompt):
    """
    Simulates calling OpenAI/Gemini to process the meta-prompt.
    In a real app, this would use `openai.ChatCompletion.create` or `genai.generate_text`.
    """
    print(f"\n[System] Connecting to LLM API to build persona for: {prompt[:50]}...")
    
    # Simulating a response from the LLM (The "Teacher Persona" script)
    generated_response = """
    --- BEGIN COPIABLE PROMPT ---
    You are Teacher Sarah, a Cambridge Primary Science examiner. 
    Your student is 8 years old.
    
    Current Topics: Forces and Magnets.
    Target Vocabulary: Force, Magnet, Pole, Attract, Repel...
    Target Grammar: Comparatives ("stronger than"), Cause/Effect.
    
    INTERACTION RULES:
    1. Ask one question at a time. Wait for the student's voice response.
    2. Start with: "Hello! I'm Teacher Sarah. Are you ready to talk about Science today? Let's start with Magnets. Can you tell me what a magnet is?"
    3. Listen to the answer. 
       - If vague, ask clarifying questions using the VRA method (Visual-Representational-Abstract).
       - Example: "Imagine you have two magnets. If you put the North poles together, what do you feel?"
    4. Correct grammar gently: "That's close! Try saying 'The magnet is stronger than the other one'."
    5. At the end, say "Test Complete" and provide a structured report:
       - Vocabulary Used: [List]
       - Grammar Corrections: [List]
       - Star Rating: [1-5]
    
    Please start the roleplay now.
    --- END COPIABLE PROMPT ---
    """
    return generated_response

if __name__ == "__main__":
    print("--- ESL Speaking Examiner: Prompt Generator Prototype ---")
    
    # 1. User selects "Forces and Magnets" (Simulated)
    selected_ids = ["unit_y3_sci_forces"]
    print(f"Selected Units: {selected_ids}")
    
    units = get_units(selected_ids)
    
    # 2. System builds the Meta-Prompt
    meta_prompt_text = build_meta_prompt(units)
    
    # 3. System calls LLM
    final_user_prompt = simulate_llm_call(meta_prompt_text)
    
    # 4. Output to User
    print("\nGenerated Prompt for ChatGPT/Gemini Live:")
    print(final_user_prompt)
