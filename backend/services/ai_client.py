import os
import requests
import json
import logging
from typing import Optional, Dict, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_api_configuration() -> Dict[str, str]:
    """
    Get API configuration from environment variables.
    """
    provider = os.getenv("AI_PROVIDER", "gemini")

    if provider == "huggingface":
        api_key = os.getenv("HF_API_KEY")
        model = os.getenv("HF_AI_MODEL", "openai-community/gpt2")
        if not api_key:
            raise ValueError("HF_API_KEY not found in environment variables")
    elif provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
    elif provider == "openrouter":
        api_key = os.getenv("AI_API_KEY")
        model = os.getenv("AI_MODEL", "anthropic/claude-3-haiku")
        if not api_key:
            raise ValueError("AI_API_KEY not found in environment variables")
    else:
        raise ValueError(f"Unsupported AI provider: {provider}")

    return {
        "api_key": api_key,
        "provider": provider,
        "model": model
    }


def build_execution_prompt(language: str, code_content: str) -> str:
    """
    Build prompt for AI code execution simulation.
    
    Args:
        language (str): Programming language name
        code_content (str): The code to execute
        
    Returns:
        str: Combined prompt for the API request
    """
    system_prompt = f"""You are a real code execution engine that runs {language} programs line-by-line.

Your job:
- Execute the given code exactly as a real interpreter or compiler would
- Process statements in strict sequential order from top to bottom
- Do not rearrange, summarize, optimize, or skip any line

Output Rules:
- Return ONLY the program's real console output (stdout/stderr)
- Do NOT include explanations, extra comments, markdown, code blocks, or decorative formatting
- If the code prints user names, IDs, roll numbers, or any personal information at the top, output them exactly in the same order
- Preserve original spacing and newlines

Error Handling:
- If execution would result in a runtime or compile error, return the exact error message text as it would appear

Input Handling:
- If the program uses input() or similar input functions:
  - Automatically supply realistic values
  - Show input prompts and chosen inputs exactly as a real execution:
      Example: Enter name: John
  - Use varied sample values across calls:
      Numbers: 12, 7, 15, 9 (avoid 0 unless necessary)
      Strings: "John", "Alice", "Rohan", "Test"
  - Choose inputs that allow the code to run without failing

Execution Style:
- Do not guess intended behavior; just execute strictly
- No simplification, no explanation
- Just the raw program output, line-by-line

Your output must contain only what the real executed program would print to the console.
"""

    user_prompt = f"Execute this {language} code and return only the output:\n\n{code_content}"
    
    return f"{system_prompt}\n\n{user_prompt}"


def detect_language(file_path: str) -> str:
    """
    Detect programming language from file extension.
    
    Args:
        file_path (str): Path to the code file
        
    Returns:
        str: Language name, defaults to "Python" if unknown
    """
    extension_map = {
        '.py': 'Python',
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.cs': 'C#',
        '.go': 'Go',
        '.rs': 'Rust',
        '.rb': 'Ruby',
        '.php': 'PHP',
        '.kt': 'Kotlin',
        '.swift': 'Swift',
        '.scala': 'Scala',
        '.sh': 'Bash',
        '.pl': 'Perl',
        '.r': 'R',
        '.m': 'MATLAB',
        '.sql': 'SQL',
        '.html': 'HTML',
        '.css': 'CSS'
    }
    
    _, ext = os.path.splitext(file_path.lower())
    return extension_map.get(ext, "Python")


def read_file_content(file_path: str) -> str:
    """
    Read file content with proper encoding handling.
    
    Args:
        file_path (str): Path to the file
        
    Returns:
        str: File content
        
    Raises:
        Exception: If file cannot be read
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            raise Exception(f"Cannot decode file: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to read file: {str(e)}")


def make_gemini_request(prompt: str, config: Dict[str, str]) -> str:
    """
    Make API request specifically to Google Gemini.
    """
    try:
        logger.info(f"[GEMINI API] Making request to model: {config['model']}")
        
        # Gemini API request format
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 1000,
                "topK": 40,
                "topP": 0.95
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH", 
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]
        }

        headers = {
            "Content-Type": "application/json"
        }

        # Gemini API endpoint with API key as URL parameter
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{config['model']}:generateContent"
        
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            params={"key": config['api_key']},
            timeout=60
        )

        logger.info(f"[GEMINI API] Response status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = response.text
            logger.error(f"[GEMINI API] Error response: {error_msg}")
            raise Exception(f"Sorry for the inconvenience, there was an API error: Gemini API returned status {response.status_code} - {error_msg}")

        try:
            data = response.json()
            logger.info(f"[GEMINI API] Response received successfully")
        except json.JSONDecodeError as e:
            logger.error(f"[GEMINI API] JSON decode error: {str(e)}")
            raise Exception(f"Sorry for the inconvenience, there was an API error: Invalid JSON response from Gemini - {response.text[:200]}")

        # Handle Gemini response format
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0 and "text" in parts[0]:
                    result = parts[0]["text"].strip()
                    logger.info(f"[GEMINI API] Successfully extracted response: {len(result)} characters")
                    return result
        
        # Check for errors in response
        if "error" in data:
            error_details = data["error"]
            if isinstance(error_details, dict) and "message" in error_details:
                raise Exception(f"Sorry for the inconvenience, there was an API error: {error_details['message']}")
            else:
                raise Exception(f"Sorry for the inconvenience, there was an API error: {error_details}")
        
        # Check for blocked content
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            if "finishReason" in candidate and candidate["finishReason"] in ["SAFETY", "RECITATION"]:
                reason = candidate["finishReason"]
                raise Exception(f"Sorry for the inconvenience, there was an API error: Content was blocked due to {reason}")
            
        # Fallback - return raw response if we can't parse it
        logger.warning(f"[GEMINI API] Unexpected response format: {data}")
        return str(data)

    except requests.exceptions.Timeout:
        raise Exception("Sorry for the inconvenience, there was an API error: Gemini API request timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Sorry for the inconvenience, there was an API error: Gemini API request failed - {str(e)}")
    except Exception as e:
        if str(e).startswith("Sorry for the inconvenience"):
            raise e
        logger.error(f"[GEMINI API] Unexpected error: {str(e)}")
        raise Exception(f"Sorry for the inconvenience, there was an API error: {str(e)}")


def make_huggingface_request(prompt: str, config: Dict[str, str]) -> str:
    """
    Make API request specifically to Hugging Face.
    """
    try:
        logger.info(f"[HF API] Making request to model: {config['model']}")
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 800,
                "temperature": 0.1,
                "do_sample": False,
                "return_full_text": False
            }
        }

        headers = {
            "Authorization": f"Bearer {config['api_key']}",
            "Content-Type": "application/json"
        }

        response = requests.post(
            f"https://api-inference.huggingface.co/models/{config['model']}",
            headers=headers,
            json=payload,
            timeout=60
        )

        logger.info(f"[HF API] Response status: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = response.text
            logger.error(f"[HF API] Error response: {error_msg}")
            raise Exception(f"Sorry for the inconvenience, there was an API error: Hugging Face API returned status {response.status_code} - {error_msg}")

        try:
            data = response.json()
        except json.JSONDecodeError as e:
            logger.error(f"[HF API] JSON decode error: {str(e)}")
            raise Exception(f"Sorry for the inconvenience, there was an API error: Invalid JSON response from Hugging Face - {response.text[:200]}")

        # Handle different response formats from Hugging Face
        if isinstance(data, list) and len(data) > 0:
            if isinstance(data[0], dict):
                if "generated_text" in data[0]:
                    result = data[0]["generated_text"].strip()
                    logger.info(f"[HF API] Successfully extracted response: {len(result)} characters")
                    return result
                elif "error" in data[0]:
                    raise Exception(f"Sorry for the inconvenience, there was an API error: {data[0]['error']}")
            else:
                result = str(data[0]).strip()
                logger.info(f"[HF API] Using first list item: {len(result)} characters")
                return result
        elif isinstance(data, dict):
            if "error" in data:
                raise Exception(f"Sorry for the inconvenience, there was an API error: {data['error']}")
            elif "generated_text" in data:
                result = data["generated_text"].strip()
                logger.info(f"[HF API] Successfully extracted response: {len(result)} characters")
                return result
            else:
                result = str(data).strip()
                logger.info(f"[HF API] Using dict as string: {len(result)} characters")
                return result
        else:
            result = str(data).strip()
            logger.info(f"[HF API] Fallback string conversion: {len(result)} characters")
            return result

    except requests.exceptions.Timeout:
        raise Exception("Sorry for the inconvenience, there was an API error: Hugging Face API request timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Sorry for the inconvenience, there was an API error: Hugging Face API request failed - {str(e)}")
    except Exception as e:
        if str(e).startswith("Sorry for the inconvenience"):
            raise e
        logger.error(f"[HF API] Unexpected error: {str(e)}")
        raise Exception(f"Sorry for the inconvenience, there was an API error: {str(e)}")


def make_openrouter_request(prompt: str, config: Dict[str, str]) -> str:
    """
    Make API request specifically to OpenRouter.
    """
    try:
        # Convert prompt to messages format for OpenRouter
        messages = [
            {"role": "system", "content": "You are a code execution simulator. Follow the instructions exactly."},
            {"role": "user", "content": prompt}
        ]
        
        payload = {
            "model": config["model"],
            "messages": messages,
            "temperature": 0.1,
            "max_tokens": 800,
            "top_p": 0.9
        }

        headers = {
            "Authorization": f"Bearer {config['api_key']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://docslayer.example.com",
            "X-Title": "DocSlayerAIExecutor"
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code != 200:
            raise Exception(f"Sorry for the inconvenience, there was an API error: OpenRouter API returned status {response.status_code} - {response.text}")
            
        data = response.json()
        
        if "choices" not in data or len(data["choices"]) == 0:
            raise Exception(f"Sorry for the inconvenience, there was an API error: Invalid OpenRouter response format - {data}")
            
        result = data["choices"][0]["message"]["content"].strip()
        logger.info(f"[OPENROUTER API] Successfully extracted response: {len(result)} characters")
        return result
        
    except Exception as e:
        if str(e).startswith("Sorry for the inconvenience"):
            raise e
        raise Exception(f"Sorry for the inconvenience, there was an API error: OpenRouter request failed - {str(e)}")


def make_api_request(prompt: str, config: Dict[str, str]) -> str:
    """
    Make API request to the configured provider.
    """
    logger.info(f"[API] Using provider: {config['provider']}, model: {config['model']}")
    
    if config["provider"] == "gemini":
        return make_gemini_request(prompt, config)
    elif config["provider"] == "huggingface":
        return make_huggingface_request(prompt, config)
    elif config["provider"] == "openrouter":
        return make_openrouter_request(prompt, config)
    else:
        raise Exception(f"Sorry for the inconvenience, unsupported provider: {config['provider']}")


def run_code_with_ai(file_path: str) -> str:
    """
    Execute code using AI simulation via configured API provider.
    
    Args:
        file_path (str): Path to the code file
        
    Returns:
        str: Simulated program output or error message
    """
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            return "Error: file not found"
        
        logger.info(f"[AI EXECUTION] Processing file: {file_path}")
        
        # Get API configuration
        try:
            config = get_api_configuration()
            logger.info(f"[AI EXECUTION] Using provider: {config['provider']}, model: {config['model']}")
        except ValueError as e:
            logger.error(f"[AI EXECUTION] Configuration error: {str(e)}")
            return f"Error: {str(e)}"
        
        # Detect language and read file
        language = detect_language(file_path)
        logger.info(f"[AI EXECUTION] Detected language: {language}")
        
        try:
            code_content = read_file_content(file_path)
            logger.info(f"[AI EXECUTION] Read {len(code_content)} characters from file")
        except Exception as e:
            logger.error(f"[AI EXECUTION] File read error: {str(e)}")
            return f"Error: {str(e)}"
        
        # Build prompt
        prompt = build_execution_prompt(language, code_content)
        
        # Make API request
        try:
            output = make_api_request(prompt, config)
            logger.info(f"[AI EXECUTION] Success for {file_path}: {len(output)} characters returned")
            return output
            
        except Exception as e:
            logger.error(f"[AI EXECUTION] API error for {file_path}: {str(e)}")
            return f"Error: {str(e)}"
            
    except Exception as e:
        logger.error(f"[AI EXECUTION] Unexpected error for {file_path}: {str(e)}")
        return f"Error: unexpected error - {str(e)}"


def is_supported_file(file_path: str) -> bool:
    """
    Check if file extension is supported for AI execution.
    
    Args:
        file_path (str): Path to the file
        
    Returns:
        bool: True if file type is supported, False otherwise
    """
    supported_extensions = {
        '.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs', '.go', '.rs',
        '.rb', '.php', '.kt', '.swift', '.scala', '.sh', '.pl', '.r',
        '.m', '.sql', '.html', '.css'
    }
    
    _, ext = os.path.splitext(file_path.lower())
    return ext in supported_extensions


def get_supported_languages() -> List[str]:
    """
    Get list of supported programming languages for AI execution.
    
    Returns:
        list: List of supported language names
    """
    return [
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'C#',
        'Go', 'Rust', 'Ruby', 'PHP', 'Kotlin', 'Swift', 'Scala', 'Bash',
        'Perl', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS'
    ]


def run_multiple_files(file_paths: List[str]) -> Dict[str, str]:
    """
    Execute multiple code files using AI simulation sequentially.
    
    Args:
        file_paths (list): List of file paths to execute
        
    Returns:
        dict: Dictionary mapping file paths to their outputs
    """
    results = {}
    logger.info(f"[AI BATCH] Starting batch execution of {len(file_paths)} files")
    
    for i, file_path in enumerate(file_paths, 1):
        logger.info(f"[AI BATCH] Processing file {i}/{len(file_paths)}: {file_path}")
        results[file_path] = run_code_with_ai(file_path)
        
        # Add a small delay between requests to respect rate limits
        if i < len(file_paths):  # Don't delay after the last request
            import time
            time.sleep(1)  # 1 second delay between requests
    
    logger.info(f"[AI BATCH] Completed batch execution")
    return results


def validate_api_connection() -> Dict[str, any]:
    """
    Validate API connection and return status information.
    
    Returns:
        dict: Status information about API connection
    """
    try:
        config = get_api_configuration()
        logger.info(f"[API VALIDATION] Testing connection with provider: {config['provider']}")
        
        # Test with a simple request
        test_prompt = "Hello, respond with just 'OK' to test the connection."
        
        response = make_api_request(test_prompt, config)
        
        return {
            "status": "connected",
            "provider": config["provider"],
            "model": config["model"],
            "test_response": response[:50] + "..." if len(response) > 50 else response
        }
        
    except Exception as e:
        logger.error(f"[API VALIDATION] Connection test failed: {str(e)}")
        return {
            "status": "error",
            "provider": "unknown",
            "model": "unknown",
            "error": str(e)
        }