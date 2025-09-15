from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
import os
import uuid
import tempfile
import json

from services.docx_generator import generate_docx

router = APIRouter()

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/generate")
async def generate_document(
    template: str = Form(...),
    syntax_highlight: str = Form("false"),
    include_credentials: str = Form("false"),
    index_auto_generation: str = Form("false"),
    page_numbering: str = Form("false"),
    index_fields: str = Form("{}"),
    # Credential fields
    studentName: str = Form(""),
    enrollmentNumber: str = Form(""),
    batchClass: str = Form(""),
    teacherName: str = Form(""),
    assignmentDate: str = Form(""),
    files: list[UploadFile] = File(...)
):
    """
    Accepts uploaded files + template configuration,
    generates a DOCX file using the chosen template with all options,
    and returns the file for download.
    """
    saved_files = []

    try:
        # Save uploaded files temporarily
        for file in files:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())
            saved_files.append(file_path)

        # Generate unique filename for output
        output_filename = f"{uuid.uuid4()}.docx"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Parse index fields JSON
        try:
            parsed_index_fields = json.loads(index_fields) if index_fields else {}
        except json.JSONDecodeError:
            parsed_index_fields = {}

        # Prepare credentials dictionary
        credentials_dict = None
        if include_credentials.lower() == "true":
            credentials_dict = {
                'Student Name': studentName,
                'Enrollment Numbers': enrollmentNumber,
                'Batch': batchClass,
                'Teacher Name': teacherName,
                'Creation Date': assignmentDate
            }

        # Debug logs
        print("Template selected:", template)
        print("Syntax highlighting:", syntax_highlight)
        print("Include credentials:", include_credentials)
        print("Credentials:", credentials_dict)
        print("Index auto generation:", index_auto_generation)
        print("Index fields:", parsed_index_fields)
        print("Page numbering:", page_numbering)
        print("Saved files:", saved_files)
        print("Output path:", output_path)
        
        # Call service layer (docx_generator) with all parameters
        generate_docx(
            files=saved_files,
            template=template,
            output_path=output_path,
            syntax_highlight=(syntax_highlight.lower() == "true"),
            include_credentials=(include_credentials.lower() == "true"),
            credentials=credentials_dict,
            index_auto_generation=(index_auto_generation.lower() == "true"),
            index_fields=parsed_index_fields,
            page_numbering=(page_numbering.lower() == "true")
        )

        # Return generated DOCX
        return FileResponse(
            output_path,
            filename="DocSlayer_Generated_Documentation.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except Exception as e:
        # Clean up files on error
        for file_path in saved_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except:
                pass
        
        print(f"Error generating document: {str(e)}")
        return JSONResponse(
            {"error": f"Failed to generate document: {str(e)}"},
            status_code=500
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