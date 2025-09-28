from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
import os
import uuid
import json
import asyncio
from typing import Optional, Dict, Any, List

from services.docx_generator import generate_docx
from services.ai_client import run_code_with_ai
import job_manager

router = APIRouter()

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def ensure_string_output(output: Any) -> str:
    """Ensure AI output is always a string to prevent downstream errors."""
    if output is None:
        return "No output generated"
    if isinstance(output, str):
        return output
    try:
        return str(output)
    except Exception:
        return "Error: Could not convert output to string"


async def background_generate_document(
    job_id: str,
    saved_files: List[str],
    template: str,
    syntax_highlight: bool,
    include_credentials: bool,
    index_auto_generation: bool,
    page_numbering: bool,
    parsed_index_fields: Dict,
    enable_ai_execution: bool,
    credentials_dict: Optional[Dict]
):
    """
    Background task function that handles the actual document generation.
    Updates job progress throughout the process.
    """
    try:
        print(f"[JOB {job_id}] Starting background generation")
        print(f"[JOB {job_id}] Files to process: {len(saved_files)}")
        print(f"[JOB {job_id}] AI execution enabled: {enable_ai_execution}")
        
        # Add a small delay to ensure frontend can start polling
        await asyncio.sleep(0.1)
        
        # Update job to running status
        job_manager.update_job(job_id, progress=10, message="Starting document generation", status="running")
        print(f"[JOB {job_id}] Progress updated to 10%")
        
        # Add another small delay for progress visibility
        await asyncio.sleep(0.2)
        
        ai_outputs = {}
        
        # Step 1: AI execution processing (if enabled)
        if enable_ai_execution:
            print(f"[JOB {job_id}] Starting AI processing")
            job_manager.update_job(job_id, progress=20, message=f"Processing {len(saved_files)} files with AI")
            print(f"[JOB {job_id}] Progress updated to 20%")
            
            # Small delay for progress visibility
            await asyncio.sleep(0.3)
            
            for i, file_path in enumerate(saved_files, 1):
                progress = 20 + (40 * i / len(saved_files))  # Progress 20-60% for AI execution
                progress_msg = f"AI processing file {i}/{len(saved_files)}: {os.path.basename(file_path)}"
                
                job_manager.update_job(
                    job_id, 
                    progress=int(progress), 
                    message=progress_msg
                )
                print(f"[JOB {job_id}] Progress updated to {int(progress)}% - {progress_msg}")
                
                try:
                    print(f"[JOB {job_id}] Processing file {i}/{len(saved_files)}: {file_path}")
                    
                    # Execute AI processing for this file
                    ai_output = run_code_with_ai(file_path)
                    
                    # Store output in memory with type safety
                    ai_outputs[file_path] = ensure_string_output(ai_output)
                    
                    print(f"[JOB {job_id}] AI processing completed for {file_path}")
                        
                except Exception as e:
                    # Store error message as output and continue
                    error_msg = f"Error: AI execution failed - {str(e)}"
                    ai_outputs[file_path] = ensure_string_output(error_msg)
                    print(f"[JOB {job_id}] AI processing failed for {file_path}: {error_msg}")
                
                # Small delay between files for progress visibility
                await asyncio.sleep(0.1)
            
            print(f"[JOB {job_id}] Completed AI processing for all files")
        else:
            job_manager.update_job(job_id, progress=60, message="AI execution disabled, proceeding to document generation")
            print(f"[JOB {job_id}] Progress updated to 60% - AI execution disabled")
            await asyncio.sleep(0.2)

        # Step 2: Generate output filename
        job_manager.update_job(job_id, progress=70, message="Preparing document generation")
        print(f"[JOB {job_id}] Progress updated to 70% - Preparing document generation")
        await asyncio.sleep(0.2)
        
        output_filename = f"DocSlayer_{uuid.uuid4().hex[:8]}.docx"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        # Step 3: Generate DOCX
        job_manager.update_job(job_id, progress=80, message="Generating DOCX document")
        print(f"[JOB {job_id}] Progress updated to 80% - Generating DOCX document")
        await asyncio.sleep(0.3)
        
        # Run the synchronous generate_docx in a thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            generate_docx,
            saved_files,
            template,
            output_path,
            syntax_highlight,
            include_credentials,
            credentials_dict,
            index_auto_generation,
            parsed_index_fields,
            page_numbering,
            ai_outputs if ai_outputs else None
        )

        print(f"[JOB {job_id}] DOCX generation completed: {output_path}")

        # Step 4: Mark job as complete
        job_manager.update_job(
            job_id,
            progress=100,
            message="Document generation completed successfully",
            status="done",
            output_filename=output_filename,
            output_path=f"/documents/download/{output_filename}"
        )
        
        print(f"[JOB {job_id}] Job marked as complete with 100% progress")

    except Exception as e:
        # Handle errors and mark job as failed
        error_msg = f"Failed to generate document: {str(e)}"
        print(f"[JOB {job_id}] ERROR: {error_msg}")
        
        job_manager.update_job(
            job_id,
            message=error_msg,
            status="error",
            error=str(e)
        )
        
        # Clean up temporary files on error
        for file_path in saved_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"[JOB {job_id}] Cleanup: Removed {file_path}")
            except Exception as cleanup_error:
                print(f"[JOB {job_id}] Cleanup error: Failed to remove {file_path}: {str(cleanup_error)}")


@router.post("/generate")
async def generate_document(
    template: str = Form(...),
    syntax_highlight: str = Form("false"),
    include_credentials: str = Form("false"),
    index_auto_generation: str = Form("false"),
    page_numbering: str = Form("false"),
    index_fields: str = Form("{}"),
    enable_ai_execution: str = Form("false"),
    # Credential fields
    studentName: str = Form(""),
    enrollmentNumber: str = Form(""),
    batchClass: str = Form(""),
    teacherName: str = Form(""),
    assignmentDate: str = Form(""),
    files: list[UploadFile] = File(...)
):
    """
    Generate a DOCX document as a background job.
    Returns immediately with jobId for progress tracking.
    """
    saved_files = []
    
    try:
        # Step 1: Create new job
        job_id = job_manager.create_job()
        job_manager.update_job(job_id, progress=5, message="Uploading and validating files")
        
        # Step 2: Save uploaded files temporarily
        print(f"[UPLOAD] Job {job_id} - Received {len(files)} files for processing")
        for file in files:
            if not file.filename:
                continue
                
            # Use simple filename (like your working version)
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            
            # Save file to temporary directory
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
                
            saved_files.append(file_path)
            print(f"[FILE SAVED] Job {job_id} - {file.filename} -> {file_path}")

        if not saved_files:
            job_manager.update_job(
                job_id, 
                message="No valid files were uploaded", 
                status="error",
                error="No valid files were uploaded"
            )
            return JSONResponse(
                {"error": "No valid files were uploaded", "jobId": job_id},
                status_code=400
            )

        # Step 3: Parse form parameters
        try:
            parsed_index_fields = json.loads(index_fields) if index_fields else {}
        except json.JSONDecodeError:
            print(f"[WARNING] Job {job_id} - Invalid index_fields JSON, using empty dict")
            parsed_index_fields = {}

        # Prepare credentials dictionary if enabled
        credentials_dict = None
        if include_credentials.lower() == "true":
            credentials_dict = {
                'Student Name': studentName,
                'Enrollment Numbers': enrollmentNumber,
                'Batch': batchClass,
                'Teacher Name': teacherName,
                'Creation Date': assignmentDate
            }

        # Step 4: Start background task using asyncio.create_task for proper concurrency
        task = asyncio.create_task(
            background_generate_document(
                job_id=job_id,
                saved_files=saved_files,
                template=template,
                syntax_highlight=(syntax_highlight.lower() == "true"),
                include_credentials=(include_credentials.lower() == "true"),
                index_auto_generation=(index_auto_generation.lower() == "true"),
                page_numbering=(page_numbering.lower() == "true"),
                parsed_index_fields=parsed_index_fields,
                enable_ai_execution=(enable_ai_execution.lower() == "true"),
                credentials_dict=credentials_dict
            )
        )

        print(f"[JOB STARTED] Job {job_id} - Background document generation started with asyncio.create_task")

        # Step 5: Return job information immediately
        return JSONResponse({
            "jobId": job_id,
            "status": "started",
            "message": "Document generation job started successfully",
            "num_files_uploaded": len(saved_files),
            "ai_execution_enabled": enable_ai_execution.lower() == "true",
            "template_used": template,
            "features_enabled": {
                "syntax_highlight": syntax_highlight.lower() == "true",
                "credentials": include_credentials.lower() == "true",
                "index": index_auto_generation.lower() == "true",
                "page_numbering": page_numbering.lower() == "true",
                "ai_execution": enable_ai_execution.lower() == "true"
            }
        })

    except Exception as e:
        # Step 6: Error handling during setup
        print(f"[ERROR] Job setup failed: {str(e)}")
        
        # Clean up temporary files on error
        for file_path in saved_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"[CLEANUP] Removed: {file_path}")
            except Exception as cleanup_error:
                print(f"[CLEANUP ERROR] Failed to remove {file_path}: {str(cleanup_error)}")
        
        # Return error response
        return JSONResponse({
            "error": f"Failed to start document generation job: {str(e)}"
        }, status_code=500)


@router.get("/progress/{job_id}")
async def get_job_progress(job_id: str):
    """
    Get the current progress and status of a document generation job.
    
    Args:
        job_id: The unique job identifier
        
    Returns:
        JSON with job status, progress, and details
    """
    job = job_manager.get_job(job_id)
    
    if not job:
        return JSONResponse(
            {"error": f"Job with ID '{job_id}' not found"},
            status_code=404
        )
    
    # Return job status information
    response_data = {
        "jobId": job["jobId"],
        "status": job["status"],
        "progress": job["progress"],
        "message": job["message"],
        "output_filename": job["output_filename"],
        "created_at": job["created_at"],
        "updated_at": job["updated_at"]
    }
    
    # Include output_path if job is done
    if job["status"] == "done" and job["output_path"]:
        response_data["output_path"] = job["output_path"]
    
    # Include error details if job failed
    if job["status"] == "error" and job["error"]:
        response_data["error"] = job["error"]
    
    return JSONResponse(response_data)


@router.get("/ai-status")
async def get_ai_status():
    """Check if AI execution service is available."""
    try:
        from services.ai_client import get_supported_languages
        
        return {
            "ai_available": True,
            "supported_languages": get_supported_languages(),
            "message": "AI execution service is available",
            "service_type": "OpenRouter AI Client"
        }
    except ImportError:
        return {
            "ai_available": False,
            "supported_languages": [],
            "message": "AI execution service is not available",
            "service_type": "None"
        }
    except Exception as e:
        print(f"[AI STATUS ERROR] {str(e)}")
        return {
            "ai_available": False,
            "supported_languages": [],
            "message": f"AI service error: {str(e)}",
            "service_type": "Error"
        }


@router.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a generated DOCX file by filename.
    
    Args:
        filename: The name of the file to download
        
    Returns:
        FileResponse: The DOCX file for download
    """
    # Normalize path to handle mixed slashes on Windows and Linux
    file_path = os.path.normpath(os.path.join(UPLOAD_DIR, filename))
    
    # Validate file exists and is accessible
    if not os.path.exists(file_path):
        print(f"[DOWNLOAD ERROR] File not found: {file_path}")
        return JSONResponse(
            {"error": "File not found", "filename": filename}, 
            status_code=404
        )
    
    # Security check: ensure file is in upload directory
    if not os.path.abspath(file_path).startswith(os.path.abspath(UPLOAD_DIR)):
        print(f"[DOWNLOAD ERROR] Security violation: {file_path}")
        return JSONResponse(
            {"error": "Invalid file path"}, 
            status_code=403
        )
    
    # Log that file is being served
    print(f"[DOWNLOAD] Serving file: {file_path}")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/jobs")
async def list_jobs():
    """
    List all jobs (useful for debugging and monitoring).
    
    Returns:
        JSON with all job states
    """
    all_jobs = job_manager.get_all_jobs()
    return {
        "jobs": list(all_jobs.values()),
        "total_jobs": len(all_jobs)
    }


@router.delete("/jobs/{job_id}")
async def cleanup_job(job_id: str):
    """
    Clean up a specific job from memory (optional endpoint).
    
    Args:
        job_id: The job ID to remove
        
    Returns:
        JSON confirmation of cleanup
    """
    success = job_manager.cleanup_job(job_id)
    
    if success:
        return {"message": f"Job {job_id} cleaned up successfully"}
    else:
        return JSONResponse(
            {"error": f"Job {job_id} not found"},
            status_code=404
        )


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "DocSlayer DOCX Generator",
        "upload_directory": UPLOAD_DIR,
        "upload_directory_exists": os.path.exists(UPLOAD_DIR),
        "supported_templates": ["template1", "template2", "template3", "template4", "template5"],
        "active_jobs": job_manager.get_job_count(),
        "background_jobs_enabled": True
    }