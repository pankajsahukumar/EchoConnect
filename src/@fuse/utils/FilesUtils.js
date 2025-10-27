import { fileTypeFromBlob } from 'file-type';

/* -------------------------------------------------------------------------- */
/*                             Type Handler Base                              */
/* -------------------------------------------------------------------------- */
class BaseFileHandler {
  constructor(file, fileId, thumbnailDimensions) {
    this.file = file;
    this.fileId = fileId;
    this.thumbnailDimensions = thumbnailDimensions;
  }

  async getTypeValidation() {
    return await fileTypeFromBlob(this.file);
  }

  async process() {
    throw new Error('process() not implemented');
  }

  createResult({
    type = 'others',
    thumbnail = undefined,
    url = undefined,
    height = null,
    width = null,
    mime = 'application/octet-stream',
  }) {
    return {
      file: this.file,
      id: this.fileId,
      attachedMessage: null,
      original_name: this.file.name,
      uploadedFileSize: 0,
      type,
      thumbnail,
      url,
      height,
      width,
      mime,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                              Video File Handler                            */
/* -------------------------------------------------------------------------- */
class VideoFileHandler extends BaseFileHandler {
  async process() {
    const actualType = await this.getTypeValidation();

    if (!actualType?.mime.startsWith('video/')) {
      return this.createResult({ type: 'others', mime: actualType?.mime });
    }

    const videoUrl = URL.createObjectURL(this.file);
    const { blob, height, width } = await FilesUtils.getSnapShotOfVideoBlob(
      videoUrl,
      15,
      this.thumbnailDimensions.height,
      this.thumbnailDimensions.width
    );

    return this.createResult({
      type: 'video',
      thumbnail: blob,
      url: videoUrl,
      height,
      width,
      mime: actualType?.mime,
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                              Image File Handler                            */
/* -------------------------------------------------------------------------- */
class ImageFileHandler extends BaseFileHandler {
  async process() {
    const actualType = await this.getTypeValidation();

    if (!actualType?.mime.startsWith('image/')) {
      return this.createResult({ type: 'others', mime: actualType?.mime });
    }

    const url = URL.createObjectURL(this.file);
    const { width, height } = await FilesUtils.getImageDimensions(url);

    return this.createResult({
      type: 'image',
      thumbnail: url,
      url,
      width: Math.round(width),
      height: Math.round(height),
      mime: actualType?.mime,
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                               SVG File Handler                             */
/* -------------------------------------------------------------------------- */
class SvgFileHandler extends BaseFileHandler {
  async process() {
    const buffer = await this.file.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    const isSvg = text.includes('<svg');

    if (!isSvg) {
      return this.createResult({ type: 'others' });
    }

    const url = URL.createObjectURL(this.file);
    const { width, height } = await FilesUtils.getImageDimensions(url);

    return this.createResult({
      type: 'svg',
      thumbnail: url,
      url,
      width: Math.round(width),
      height: Math.round(height),
      mime: 'image/svg+xml',
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                               PDF File Handler                             */
/* -------------------------------------------------------------------------- */
class PdfFileHandler extends BaseFileHandler {
  async process() {
    const actualType = await this.getTypeValidation();

    if (!actualType?.mime.startsWith('application/pdf')) {
      return this.createResult({ type: 'others', mime: actualType?.mime });
    }

    return this.createResult({
      type: 'pdf',
      mime: actualType?.mime,
    });
  }
}

/* -------------------------------------------------------------------------- */
/*                            Default (Others) Handler                        */
/* -------------------------------------------------------------------------- */
class DefaultFileHandler extends BaseFileHandler {
  async process() {
    return this.createResult({ type: 'others' });
  }
}

/* -------------------------------------------------------------------------- */
/*                                Main Utility                                */
/* -------------------------------------------------------------------------- */
class FilesUtils {
  static handlers = [
    { match: (type) => type.startsWith('video/'), handler: VideoFileHandler },
    { match: (type) => type.startsWith('image/svg'), handler: SvgFileHandler },
    { match: (type) => type.startsWith('image/'), handler: ImageFileHandler },
    { match: (type) => type.startsWith('application/pdf') || type.startsWith('pdf/'), handler: PdfFileHandler },
  ];

  static getHandlerForType(fileType) {
    const found = this.handlers.find((h) => h.match(fileType));
    return found ? found.handler : DefaultFileHandler;
  }

  static async validateFilesAndGetThumbnails(files, from, thumbnailDimensions) {
    let results = [];

    for (const file of files) {
      try {
        const HandlerClass = this.getHandlerForType(file.file.type);
        const handler = new HandlerClass(file.file, file.id, thumbnailDimensions);
        const processed = await handler.process();
        results.push(processed);
      } catch (err) {
        console.error('❌ Error processing file:', file.file.name, err);
      }
    }

    if (from === 'videos&photos') {
      results = results.filter((f) => ['image', 'video', 'svg'].includes(f.type));
    }

    return results;
  }

  /* ------------------------- Helper Methods (static) ------------------------ */
  static getImageDimensions(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;

      img.src = imageUrl;
    });
  }

  static async getSnapShotOfVideoBlob(videoUrl, snapshotTime, width, height) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';

      video.onloadedmetadata = () => {
        video.currentTime = snapshotTime;
      };

      video.onseeked = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const finalWidth = width || 300;
        const finalHeight = height || finalWidth / aspectRatio;

        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], 'snapshot.png', { type: 'image/png' });
              resolve({ blob, file, width: finalWidth, height: Math.round(finalHeight) });
            } else {
              reject(new Error('Error creating Blob from canvas.'));
            }
          },
          'image/png',
          0.1
        );
      };

      video.onerror = () => reject(new Error('Error loading video.'));
    });
  }
}

export default FilesUtils;
