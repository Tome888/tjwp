"use client"

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import type { Dict } from "@/i18n/en"
import { Check, Copy, PaperPlaneTilt } from "@phosphor-icons/react"

// Same rules as before; names may now also be written in Cyrillic.
const rules = {
  name: /^(?=.*\S)[A-Za-zÀ-žЀ-ӿ\s'.-]{2,50}$/,
  phone: /^(?=.*\S)\+?[0-9\s()-]{7,20}$/,
  email: /^(?=.*\S)[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  message: /^(?=.*\S)[\s\S]{10,1000}$/,
}

type Field = keyof typeof rules
type Topic = keyof Dict["contact"]["topics"]
const fields: Field[] = ["name", "phone", "email", "message"]

export function ContactForm({ t }: { t: Dict["contact"] }) {
  const form = useRef<HTMLFormElement>(null)
  const topics = Object.keys(t.topics) as Topic[]
  const [topic, setTopic] = useState<Topic>("project")

  // Links like /contact?topic=product preselect the topic.
  useEffect(() => {
    const wanted = new URLSearchParams(location.search).get("topic")
    if (wanted && wanted in t.topics) setTopic(wanted as Topic)
  }, [t.topics])
  const [values, setValues] = useState<Record<Field, string>>({ name: "", phone: "", email: "", message: "" })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle")

  const check = (field: Field, value: string) => (rules[field].test(value.trim()) ? undefined : t.errors[field])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Partial<Record<Field, string>> = {}
    for (const f of fields) next[f] = check(f, values[f])
    setErrors(next)
    const firstInvalid = fields.find((f) => next[f])
    if (firstInvalid) {
      form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus("sending")
    const topicLabel = t.topics[topic]
    const bundle = `
Topic: ${topicLabel}
Name: ${values.name}
Phone: ${values.phone}
Email: ${values.email}
Message: ${values.message}
`
    try {
      const { default: emailjs } = await import("@emailjs/browser")
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          user_name: values.name,
          user_phone: values.phone,
          user_email: values.email,
          topic: topicLabel,
          message: bundle,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      setStatus("sent")
      setValues({ name: "", phone: "", email: "", message: "" })
    } catch {
      setStatus("failed")
    }
  }

  const bind = (field: Field) => ({
    id: `f-${field}`,
    name: field,
    value: values[field],
    required: true,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `f-${field}-error` : undefined,
    onChange: (e: { target: { value: string } }) => {
      const value = e.target.value
      setValues((v) => ({ ...v, [field]: value }))
      if (errors[field]) setErrors((er) => ({ ...er, [field]: check(field, value) }))
      if (status === "sent" || status === "failed") setStatus("idle")
    },
  })

  const fieldError = (field: Field) =>
    errors[field] ? (
      <span id={`f-${field}-error`} className="field__error block">
        {errors[field]}
      </span>
    ) : null

  const row = (field: Field, label: string, input: ReactNode) => (
    <label className="field" htmlFor={`f-${field}`} data-invalid={errors[field] ? "" : undefined}>
      <span className="field__label">{label}</span>
      {input}
      {fieldError(field)}
    </label>
  )

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-6" aria-label={t.formLabel}>
      <fieldset className="min-w-0">
        <legend className="footnote form-group-label">{t.topicLabel}</legend>
        <div className="chips">
          {topics.map((key) => (
            <label key={key} className="chip cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={key}
                checked={topic === key}
                onChange={() => setTopic(key)}
                className="sr-only"
              />
              {t.topics[key]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="fields">
        {row("name", t.name, <input {...bind("name")} autoComplete="name" placeholder={t.namePlaceholder} />)}
        {row(
          "phone",
          t.phone,
          <input {...bind("phone")} type="tel" autoComplete="tel" placeholder={t.phonePlaceholder} />,
        )}
        {row(
          "email",
          t.email,
          <input {...bind("email")} type="email" autoComplete="email" placeholder={t.emailPlaceholder} />,
        )}
      </div>

      <div className="fields">
        {row("message", t.message, <textarea {...bind("message")} rows={5} placeholder={t.messagePlaceholder} />)}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="submit" className="btn btn--fill w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.send}
          <PaperPlaneTilt weight="fill" aria-hidden="true" />
        </button>
        <p role="status" className="form-status" data-state={status}>
          {status === "sent" ? t.sent : status === "failed" ? t.failed : ""}
        </p>
      </div>
    </form>
  )
}

export function CopyEmail({ email, t }: { email: string; t: Dict["contact"] }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="btn btn--tinted btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
    >
      {copied ? <Check weight="bold" aria-hidden="true" /> : <Copy weight="bold" aria-hidden="true" />}
      <span aria-live="polite">{copied ? t.copied : t.copy}</span>
    </button>
  )
}
