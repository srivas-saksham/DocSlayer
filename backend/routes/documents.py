from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
import os
import uuid
import tempfile
import shutil

from services.docx_generator import generate_docx
from docx2pdf import convert  # Make sure docx2pdf is installed

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

    # Debug logs
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
        return JSONResponse({"error": "File not found"}, status_code=404)
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@router.post("/convert-to-pdf")
async def convert_docx_to_pdf(file: UploadFile = File(...)):
    """
    Accepts a DOCX file, makes a safe copy, converts it to PDF,
    and returns the PDF file.
    """
    try:
        # Save uploaded DOCX temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as temp_docx:
            content = await file.read()
            temp_docx.write(content)
            temp_docx.flush()

            # Create a safe copy (avoids "File In Use" lock by Word)
            temp_copy = temp_docx.name.replace(".docx", "_copy.docx")
            shutil.copy(temp_docx.name, temp_copy)

            # Convert copy → PDF
            temp_pdf_path = temp_docx.name.replace(".docx", ".pdf")
            convert(temp_copy, temp_pdf_path)

        # Return the PDF
        return FileResponse(
            temp_pdf_path,
            filename=os.path.basename(temp_pdf_path),
            media_type="application/pdf"
        )

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
