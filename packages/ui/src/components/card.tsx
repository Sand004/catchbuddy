import * as React from "react"
import { cn } from "../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl bg-card text-card-foreground shadow-lg/25 transition-all hover:shadow-xl/30",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Mobile-optimized card variant for equipment items
const EquipmentCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    image?: string
    title: string
    subtitle?: string
    favorite?: boolean
    onFavoriteToggle?: () => void
  }
>(({ className, image, title, subtitle, favorite, onFavoriteToggle, children, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "relative overflow-hidden cursor-pointer transition-transform active:scale-[0.98]",
      className
    )}
    {...props}
  >
    {image && (
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    )}
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{title}</h4>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle()
            }}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label={favorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
          >
            <svg
              className={cn(
                "w-5 h-5 transition-colors",
                favorite ? "text-cs-secondary fill-cs-secondary" : "text-muted-foreground"
              )}
              fill={favorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>
      {children}
    </div>
  </Card>
))
EquipmentCard.displayName = "EquipmentCard"

// Catch card variant for fishing logs
const CatchCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    species: string
    weight?: number
    length?: number
    location: string
    date: string
    image?: string
  }
>(({ className, species, weight, length, location, date, image, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("overflow-hidden", className)}
    {...props}
  >
    <div className="flex gap-4 p-4">
      {image && (
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <img
            src={image}
            alt={`${species} Fang`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg">{species}</h4>
        <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
          {weight && <span>{weight}kg</span>}
          {length && <span>{length}cm</span>}
        </div>
        <div className="mt-2 text-sm">
          <p className="text-muted-foreground">{location}</p>
          <p className="text-muted-foreground">{date}</p>
        </div>
      </div>
    </div>
  </Card>
))
CatchCard.displayName = "CatchCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  EquipmentCard,
  CatchCard,
}