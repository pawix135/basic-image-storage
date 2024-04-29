# Basic development Express server for image storage/serving

Upload image and serve it.

## How to use?

File uploading

```typescript
const uploadData = new FormData();

uploadData.set("image", file);

const response = await fetch("http://localhost:8080/upload", {
  method: "POST",
  body: uploadData,
});

const image = (await response.json()) as ImageUpload;
```

File serving

```
http://localhost:8080/image?image=<filename>
```

## Interfaces

```typescript
export interface ImageUpload {
  ok: boolean; // true if file have been uploaded correctly
  error?: string; // if invalid mimetype or exceeded file size
  filename?: string;
  url?: string;
}
```
