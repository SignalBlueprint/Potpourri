export function TrustBadges() {
  const badges = [
    { icon: '✨', text: 'Curated gifts' },
    { icon: '🏡', text: 'Local favorites' },
    { icon: '🛍️', text: 'Easy pickup' },
  ]

  return (
    <section className="py-8 sm:py-12">
      <div className="rounded-2xl bg-neutral-100/80 px-6 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 text-neutral-700">
              <span className="text-xl">{badge.icon}</span>
              <span className="font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
