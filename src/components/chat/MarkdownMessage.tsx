import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownMessageProps {
  content: string
  className?: string
}

/** Renders markdown content ChatGPT-style (paragraphs, lists, bold, code, links). */
export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  if (!content) return null
  return (
    <div className={`text-sm text-slate-800 [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:my-1.5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h1,h2]:font-semibold [&_h1,h2]:text-slate-900 [&_a]:text-emerald-600 [&_a]:no-underline hover:[&_a]:underline [&_strong]:font-semibold [&_strong]:text-slate-900 [&_code]:text-xs [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-slate-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
