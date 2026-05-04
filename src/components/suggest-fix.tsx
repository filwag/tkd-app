'use client'

const REPO = 'https://github.com/filwag/tkd-app'

export function SuggestFix() {
  function buildUrl() {
    const page = window.location.href
    const body = `**Page:** ${page}\n\n**What needs fixing?**\n\n`
    return (
      `${REPO}/issues/new` +
      `?title=${encodeURIComponent('Content fix / suggestion')}` +
      `&body=${encodeURIComponent(body)}` +
      `&labels=content-fix`
    )
  }

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        window.open(buildUrl(), '_blank', 'noopener,noreferrer')
      }}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm hover:text-gray-800 hover:ring-gray-300 transition-colors"
      aria-label="Suggest a fix or report incorrect content"
    >
      Suggest a fix
    </a>
  )
}
