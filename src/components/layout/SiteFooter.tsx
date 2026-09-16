export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <p className="text-xs text-muted-foreground">Powered by <a href="https://tabstr.net/" target="_blank" rel="noopener noreferrer">Tabstr</a></p>
        <p className="text-xs text-muted-foreground">
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
