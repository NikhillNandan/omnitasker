import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

/**
 * FileUploader – drag-and-drop + click file input with active file feedback.
 *
 * Props (all variants supported for full backward-compat):
 *  onFiles(files)         – original prop: called with accepted File[] on drop/select
 *  onFilesSelected(files) – alias for onFiles
 *  selectedFile           – optional File object or filename string
 *  accept                 – react-dropzone accept object  e.g. { 'image/*': [] }
 *  multiple               – boolean, defaults to false
 *  maxFiles               – number alias: maxFiles > 1 enables multiple
 *  label                  – string shown inside drop zone
 *  subLabel               – secondary helper text
 *  sublabel               – lowercase alias for subLabel
 *  icon                   – emoji/svg shown in drop zone
 *  className              – extra classes on wrapper
 */
export default function FileUploader({
  onFiles,
  onFilesSelected,
  selectedFile,
  accept,
  multiple = false,
  maxFiles,
  label = 'Drop your file here',
  subLabel,
  sublabel,
  icon = null,
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeFileName, setActiveFileName] = useState(
    typeof selectedFile === 'string' ? selectedFile : selectedFile?.name || null
  )

  useEffect(() => {
    if (selectedFile) {
      setActiveFileName(typeof selectedFile === 'string' ? selectedFile : selectedFile.name)
    } else if (selectedFile === null) {
      setActiveFileName(null)
    }
  }, [selectedFile])

  // Resolve aliased props so ALL pages work regardless of which variant they pass
  const callback = onFilesSelected || onFiles
  const isMultiple = typeof maxFiles === 'number' ? maxFiles > 1 : multiple
  const helperText = subLabel ?? sublabel ?? 'or click to browse'

  const onDrop = useCallback(
    (accepted) => {
      if (accepted?.length && callback) {
        if (!isMultiple && accepted[0]?.name) {
          setActiveFileName(accepted[0].name)
        } else if (isMultiple && accepted.length > 0) {
          setActiveFileName(`${accepted.length} file${accepted.length !== 1 ? 's' : ''} selected`)
        }
        callback(accepted)
      }
      setIsDragging(false)
    },
    [callback, isMultiple]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: isMultiple,
    maxFiles: typeof maxFiles === 'number' ? maxFiles : undefined,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div
      {...getRootProps()}
      className={`drop-zone ${isDragActive ? 'active' : ''} ${className}`}
      tabIndex={0}
      role="button"
      aria-label="File upload area"
    >
      <input {...getInputProps()} />

      <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
        {icon ?? (
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: activeFileName
                ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(59,130,246,0.25))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.2))',
            }}
          >
            {activeFileName ? (
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      <div className="text-center max-w-full px-2">
        {activeFileName && !isDragActive ? (
          <div>
            <p className="text-emerald-300 font-bold text-sm mb-0.5 truncate max-w-[260px] mx-auto">
              📄 {activeFileName}
            </p>
            <p className="text-slate-400 text-xs">Click or drag a new file to replace</p>
          </div>
        ) : (
          <>
            <p className="text-slate-200 font-semibold text-base mb-1">
              {isDragActive ? 'Release to upload' : label}
            </p>
            <p className="text-slate-500 text-sm">{helperText}</p>
          </>
        )}
      </div>
    </div>
  )
}
