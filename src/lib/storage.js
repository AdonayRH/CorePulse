import { supabase } from './supabase'

const BUCKET = 'course-videos'
export const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024 // 2 GB

export async function uploadVideo(file, { userId, courseId, videoId, onProgress, xhrRef }) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Sesión no encontrada. Inicia sesión de nuevo.')

  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
  const path = `${userId}/${courseId}/${videoId}.${ext}`
  const uploadUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    if (xhrRef) xhrRef.current = xhr

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    })

    xhr.addEventListener('load', () => {
      if (xhrRef) xhrRef.current = null
      if (xhr.status >= 200 && xhr.status < 300) {
        const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
        resolve(publicUrl)
      } else {
        let msg = 'Error al subir el video'
        try { msg = JSON.parse(xhr.responseText)?.message || msg } catch {}
        reject(new Error(msg))
      }
    })

    xhr.addEventListener('error', () => {
      if (xhrRef) xhrRef.current = null
      reject(new Error('Error de red durante la subida'))
    })

    xhr.addEventListener('abort', () => {
      if (xhrRef) xhrRef.current = null
      reject(new Error('Subida cancelada'))
    })

    xhr.open('POST', uploadUrl)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')
    xhr.setRequestHeader('x-upsert', 'true')
    xhr.send(file)
  })
}

export async function deleteVideo(videoUrl) {
  const marker = `/object/public/${BUCKET}/`
  const idx = videoUrl?.indexOf(marker)
  if (!idx || idx === -1) return
  const path = videoUrl.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}
