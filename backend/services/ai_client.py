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
    
    Returns:
        dict: Configuration containing API key, provider, and model
        
    Raises:
        ValueError: If required API key is not found in environment
    """
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise ValueError("AI_API_KEY not found in environment variables. Please set it in your .env file")
    
    return {
        "api_key": api_key,
        "provider": os.getenv("AI_PROVIDER", "openrouter"),
        "model": os.getenv("AI_MODEL", "openai/gpt-4")
    }


def get_api_headers(api_key: str) -> Dict[str, str]:
    """
    Get headers for OpenRouter API requests.
    
    Args:
        api_key (str): The API key for authentication
        
    Returns:
        dict: Headers including authorization and content type
    """
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://docslayer.example.com",
        "X-Title": "DocSlayerAIExecutor"
    }


def build_execution_prompt(language: str, code_content: str) -> List[Dict[str, str]]:
    """
    Build messages for AI code execution simulation.
    
    Args:
        language (str): Programming language name
        code_content (str): The code to execute
        
    Returns:
        list: List of messages for the API request
    """
    system_prompt = f"""You are a code execution simulator for {language} programs.
Your task is to execute the given code exactly as if it ran in a real environment.

Rules:
- Return ONLY the program's console output (stdout/stderr)
- If there are errors, return the exact error messages
- Do not add explanations, comments, or formatting
- Do not use markdown, code blocks, or backticks
- Simulate a deterministic execution (use consistent random seeds if needed)
- Assume no external input unless provided in the code
- Return plain text output only"""

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Execute this {language} code and return only the output:\n\n{code_content}"}
    ]


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
    # Try UTF-8 first
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Fallback to latin-1 for files with special characters
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            raise Exception(f"Cannot decode file: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to read file: {str(e)}")


def make_api_request(messages: List[Dict[str, str]], config: Dict[str, str]) -> str:
    """
    Make API request to OpenRouter.
    
    Args:
        messages (list): Messages for the API request
        config (dict): API configuration
        
    Returns:
        str: API response content
        
    Raises:
        Exception: If API request fails
    """
    payload = {
        "model": config["model"],
        "messages": messages,
        "temperature": 0.1,  # Low temperature for consistent execution simulation
        "max_tokens": 500,
        "top_p": 0.9
    }
    
    headers = get_api_headers(config["api_key"])
    
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=45  # Increased timeout for code execution
        )
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                error_msg = error_data.get('error', {}).get('message', f'HTTP {response.status_code}')
            except:
                error_msg = f'HTTP {response.status_code}'
            raise Exception(f"API returned error: {error_msg}")
        
        response_data = response.json()
        
        if 'choices' not in response_data or len(response_data['choices']) == 0:
            raise Exception("Invalid API response format")
        
        content = response_data['choices'][0]['message']['content']
        return content.strip() if content else "No output generated"
        
    except requests.exceptions.Timeout:
        raise Exception("API request timed out")
    except requests.exceptions.ConnectionError:
        raise Exception("Unable to connect to API")
    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed: {str(e)}")
    except json.JSONDecodeError:
        raise Exception("Invalid JSON response from API")
    except KeyError as e:
        raise Exception(f"Missing key in API response: {str(e)}")


def run_code_with_ai(file_path: str) -> str:
    """
    Execute code using AI simulation via OpenRouter API.
    
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
        except ValueError as e:
            logger.error(f"[AI EXECUTION] Configuration error: {str(e)}")
            return f"Error: {str(e)}"
        
        # Detect language and read file
        language = detect_language(file_path)
        logger.info(f"[AI EXECUTION] Detected language: {language}")
        
        try:
            code_content = read_file_content(file_path)
        except Exception as e:
            logger.error(f"[AI EXECUTION] File read error: {str(e)}")
            return f"Error: {str(e)}"
        
        # Build API request
        messages = build_execution_prompt(language, code_content)
        
        # Make API request
        try:
            output = make_api_request(messages, config)
            logger.info(f"[AI EXECUTION] Success for {file_path}: {output[:100]}...")
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
        
        # Test with a simple request
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, respond with just 'OK' to test the connection."}
        ]
        
        response = make_api_request(messages, config)
        
        return {
            "status": "connected",
            "provider": config["provider"],
            "model": config["model"],
            "test_response": response[:50] + "..." if len(response) > 50 else response
        }
        
    except Exception as e:
        return {
            "status": "error",
            "provider": "unknown",
            "model": "unknown",
            "error": str(e)
        }