import type { ChangeEvent, FormEvent, ReactNode } from "react"
import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLocale } from "@/i18n/useLocale"

export interface ReservationFormValues {
  customerName: string
  phone: string
  allergies: string
}

interface ReservationFormProps {
  summary: string
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: (values: ReservationFormValues) => void
}

const EMPTY_VALUES: ReservationFormValues = {
  customerName: "",
  phone: "",
  allergies: "",
}

export function ReservationForm({
  summary,
  canSubmit,
  isSubmitting,
  onSubmit,
}: ReservationFormProps) {
  const { t } = useLocale()
  const [values, setValues] = useState<ReservationFormValues>(EMPTY_VALUES)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const fieldPrefix = useId()

  const isNameValid = values.customerName.trim().length >= 2
  const showNameError = hasSubmitted && !isNameValid

  function updateField(field: keyof ReservationFormValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setValues((previous) => ({ ...previous, [field]: value }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSubmitted(true)
    if (!isNameValid || !canSubmit) return
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id={`${fieldPrefix}-name`}
          label={t("form.name")}
          error={showNameError ? t("form.nameError") : undefined}
        >
          <Input
            id={`${fieldPrefix}-name`}
            className="h-11"
            autoComplete="name"
            placeholder={t("form.namePlaceholder")}
            aria-invalid={showNameError || undefined}
            value={values.customerName}
            onChange={updateField("customerName")}
          />
        </FormField>

        <FormField id={`${fieldPrefix}-phone`} label={t("form.phone")}>
          <Input
            id={`${fieldPrefix}-phone`}
            className="h-11"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("form.phonePlaceholder")}
            value={values.phone}
            onChange={updateField("phone")}
          />
        </FormField>
      </div>

      <FormField id={`${fieldPrefix}-allergies`} label={t("form.notes")}>
        <Textarea
          id={`${fieldPrefix}-allergies`}
          rows={3}
          placeholder={t("form.notesPlaceholder")}
          value={values.allergies}
          onChange={updateField("allergies")}
        />
      </FormField>

      <div className="rounded-xl border border-border bg-card px-4 py-3.5">
        <p className="eyebrow text-xs text-muted-foreground">
          {t("form.summary")}
        </p>
        <p className="serif-heading mt-2 text-base">{summary}</p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full text-base"
        disabled={isSubmitting || !canSubmit}
      >
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </Button>
    </form>
  )
}

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="eyebrow text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-2 text-xs text-foreground/90">
          <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
