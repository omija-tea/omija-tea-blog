---
base: "[[TIL.base]]"
태그: []
날짜: 2024-06-11
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
