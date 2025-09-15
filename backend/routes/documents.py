from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
import uuid

from services.docx_generator import generate_docx

router = APIRouter()

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/generate")
async def generate_document(
    template: str = Form(...),
    syntax_highlight: str = Form("false"),
    files: list[UploadFile] = File(...)
):
    """
    Accepts uploaded files + template name, 
    generates a DOCX file using the chosen template,
    and returns the file for download.
    """
    saved_files = []

    # Save uploaded files temporarily
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        saved_files.append(file_path)

    # Generate unique filename for output
    output_filename = f"{uuid.uuid4()}.docx"
    output_path = os.path.join(UPLOAD_DIR, output_filename)

      # 🔹 Add debug logs here
    print("Template selected:", template)
    print("Saved files:", saved_files)
    print("Output path:", output_path)
    
    # Call service layer (docx_generator)
    generate_docx(saved_files, template, output_path, highlight=(syntax_highlight.lower() == "true"))

    # Return generated DOCX
    return FileResponse(
        output_path,
        filename="generated.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download an already generated DOCX file by filename.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
