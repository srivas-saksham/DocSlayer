"""
Job Manager for tracking background document generation tasks.
Provides in-memory storage for job states and progress tracking.
"""
import uuid
from typing import Dict, Any, Optional
from datetime import datetime

# Global in-memory job store
jobs_store: Dict[str, Dict[str, Any]] = {}


def create_job() -> str:
    """
    Create a new job and return its unique jobId.
    
    Returns:
        str: Unique job ID (UUID4)
    """
    job_id = str(uuid.uuid4())
    
    jobs_store[job_id] = {
        "jobId": job_id,
        "status": "started",
        "progress": 0,
        "message": "Job created, preparing for execution",
        "output_filename": None,
        "output_path": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "error": None
    }
    
    print(f"[JOB MANAGER] Created job {job_id}")
    return job_id


def update_job(
    job_id: str,
    progress: Optional[int] = None,
    message: Optional[str] = None,
    status: Optional[str] = None,
    output_filename: Optional[str] = None,
    output_path: Optional[str] = None,
    error: Optional[str] = None
) -> bool:
    """
    Update job state with new information.
    
    Args:
        job_id: The job ID to update
        progress: Progress percentage (0-100)
        message: Status message
        status: Job status ("started", "running", "done", "error")
        output_filename: Name of generated file (when complete)
        output_path: Full path to generated file (when complete)
        error: Error message (if job failed)
        
    Returns:
        bool: True if job was updated, False if job not found
    """
    if job_id not in jobs_store:
        print(f"[JOB MANAGER] Job {job_id} not found for update")
        return False
    
    job = jobs_store[job_id]
    
    # Update provided fields
    if progress is not None:
        job["progress"] = min(100, max(0, progress))  # Clamp to 0-100
    if message is not None:
        job["message"] = message
    if status is not None:
        job["status"] = status
    if output_filename is not None:
        job["output_filename"] = output_filename
    if output_path is not None:
        job["output_path"] = output_path
    if error is not None:
        job["error"] = error
        
    job["updated_at"] = datetime.now().isoformat()
    
    print(f"[JOB MANAGER] Updated job {job_id}: status={job['status']}, progress={job['progress']}%")
    return True


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve job state by job ID.
    
    Args:
        job_id: The job ID to retrieve
        
    Returns:
        Dict with job state, or None if job not found
    """
    job = jobs_store.get(job_id)
    if job:
        print(f"[JOB MANAGER] Retrieved job {job_id}: status={job['status']}")
    else:
        print(f"[JOB MANAGER] Job {job_id} not found")
    return job


def get_all_jobs() -> Dict[str, Dict[str, Any]]:
    """
    Get all jobs (useful for debugging).
    
    Returns:
        Dict of all job states
    """
    return jobs_store.copy()


def cleanup_job(job_id: str) -> bool:
    """
    Remove a job from the store (optional cleanup).
    
    Args:
        job_id: The job ID to remove
        
    Returns:
        bool: True if job was removed, False if not found
    """
    if job_id in jobs_store:
        del jobs_store[job_id]
        print(f"[JOB MANAGER] Cleaned up job {job_id}")
        return True
    return False


def get_job_count() -> int:
    """
    Get the total number of jobs in the store.
    
    Returns:
        int: Number of jobs
    """
    return len(jobs_store)