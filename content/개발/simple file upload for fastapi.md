---
title: "simple file upload for fastapi"
date: 2024-06-11 19:18
tags:
  - topic/fastapi
  - topic/python
  - type/note
publish: true
date created: 2026-03-21T23:07
date modified: 2026-04-22T16:17
---
```python
@router.post("/uploadfile", summary="Upload File")
async def upload_file(file : UploadFile):
    '''
    Upload File to server local
    file size should be less than **5MB**'''
    file_bytes = file.file.read()
    if len(file_bytes) > 5000000:
        return {"error": "File Size is too large"}
    with open(f"app/downloaded/{file.filename}", "wb") as f:
        f.write(file_bytes)
    return {"message": "File Uploaded Successfully"}

```
간단하게 5mb 이하의 파일을 받아서 서버에 던져놓는 코드조각
