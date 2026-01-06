import { useState } from 'react'
import { Card, SectionTitle } from '../index'
import { clientConfig } from '../../client.config'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-neutral-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials() {
  const { testimonials } = clientConfig
  const [activeIndex, setActiveIndex] = useState(0)

  if (!testimonials.enabled || testimonials.items.length === 0) {
    return null
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.items.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.items.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-12 sm:py-16">
      <SectionTitle subtitle={testimonials.subtitle} className="text-center mb-8">
        {testimonials.title}
      </SectionTitle>

      {/* Desktop: Show all testimonials in a grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {testimonials.items.map((testimonial) => (
          <Card key={testimonial.id} className="flex flex-col">
            <StarRating rating={testimonial.rating} />
            <blockquote className="mt-4 flex-1 text-neutral-600 leading-relaxed">
              "{testimonial.text}"
            </blockquote>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="font-medium text-neutral-900">{testimonial.name}</p>
              <p className="text-sm text-neutral-500">{testimonial.location}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile: Carousel with navigation */}
      <div className="md:hidden">
        {(() => {
          const activeTestimonial = testimonials.items[activeIndex]
          if (!activeTestimonial) return null
          return (
            <Card className="relative">
              <StarRating rating={activeTestimonial.rating} />
              <blockquote className="mt-4 text-neutral-600 leading-relaxed min-h-[80px]">
                "{activeTestimonial.text}"
              </blockquote>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="font-medium text-neutral-900">{activeTestimonial.name}</p>
                <p className="text-sm text-neutral-500">{activeTestimonial.location}</p>
              </div>
            </Card>
          )
        })()}

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            aria-label="Previous testimonial"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {testimonials.items.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-brand-primary' : 'bg-neutral-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            aria-label="Next testimonial"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
