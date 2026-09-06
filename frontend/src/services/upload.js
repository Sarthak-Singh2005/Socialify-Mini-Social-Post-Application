const MAX_IMAGE_DIMENSION = 1600
const JPEG_QUALITY = 0.8

export function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        // Resize large images before embedding them in the request body.
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      image.onerror = () => reject(new Error('Could not process image'))
      image.src = reader.result
    }
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(file)
  })
}
