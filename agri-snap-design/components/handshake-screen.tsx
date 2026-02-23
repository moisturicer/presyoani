"use client"

import { useState } from "react"
import {
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Handshake,
  ShieldCheck,
  ImageIcon,
  X,
  Star,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const notifications = [
  {
    id: 1,
    type: "interest" as const,
    buyer: "Nestl\u00e9 Philippines",
    crop: "Tomatoes",
    volume: "100kg",
    phone: "+63 917 XXX 1234",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    type: "accepted" as const,
    buyer: "Metro Fresh Market",
    crop: "Rice",
    volume: "500kg",
    phone: "+63 928 XXX 5678",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "interest" as const,
    buyer: "Local Cooperative",
    crop: "Corn",
    volume: "200kg",
    phone: "+63 935 XXX 9012",
    time: "3 hours ago",
    read: true,
  },
]

export function HandshakeScreen() {
  const [selectedNotification, setSelectedNotification] = useState<
    number | null
  >(null)
  const selected = notifications.find((n) => n.id === selectedNotification)

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Connections</h2>
          <p className="text-xs text-muted-foreground">
            Buyer interest & direct contacts
          </p>
        </div>
        <Badge variant="secondary" className="text-xs font-bold">
          {notifications.filter((n) => !n.read).length} New
        </Badge>
      </div>

      {/* SMS-Style Notification Cards */}
      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`cursor-pointer border-2 transition-all hover:shadow-md ${
              !notif.read
                ? "border-secondary bg-secondary/5"
                : "border-border/60"
            } ${selectedNotification === notif.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedNotification(notif.id)}
            role="button"
            tabIndex={0}
            aria-label={`Notification from ${notif.buyer}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    notif.type === "interest"
                      ? "bg-secondary/20"
                      : "bg-green-100"
                  }`}
                >
                  {notif.type === "interest" ? (
                    <Handshake className="h-5 w-5 text-secondary-foreground" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {notif.buyer}
                    </span>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-secondary" />
                    )}
                  </div>

                  {/* SMS-style message */}
                  <div className="mt-1.5 rounded-xl rounded-tl-none bg-muted p-3">
                    <p className="text-sm leading-relaxed text-foreground">
                      {notif.type === "interest" ? (
                        <>
                          {"Interested in your "}
                          <span className="font-bold">
                            {notif.volume} {notif.crop}
                          </span>
                          {". Call "}
                          <span className="font-bold text-primary">
                            {notif.phone}
                          </span>
                          {" to negotiate."}
                        </>
                      ) : (
                        <>
                          {"Deal accepted for "}
                          <span className="font-bold">
                            {notif.volume} {notif.crop}
                          </span>
                          {". Pickup scheduled."}
                        </>
                      )}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {notif.time}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-xs bg-transparent"
                      >
                        <MessageSquare className="h-3 w-3" />
                        SMS
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 gap-1 bg-primary text-xs text-primary-foreground"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Direct Connection Modal */}
      {selected && (
        <Card className="overflow-hidden border-2 border-primary">
          <div className="bg-primary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-secondary" />
                <span className="text-sm font-bold text-primary-foreground">
                  Direct Connection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <CardContent className="p-4">
            {/* Buyer Info */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selected.buyer}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Verified Buyer
                </div>
              </div>
            </div>

            {/* Harvest Audit Photo */}
            <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted">
              <div className="flex h-40 items-center justify-center bg-primary/5">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-primary/30" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Verified Harvest Audit Photo
                  </span>
                  <Badge variant="outline" className="text-xs">
                    AI-Verified: Grade A
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between bg-card p-3">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {selected.volume} {selected.crop}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Pangasinan, Central Luzon
                  </p>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  Fresh
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2 border-2 bg-transparent"
                onClick={() => setSelectedNotification(null)}
              >
                <MessageSquare className="h-4 w-4" />
                Send SMS
              </Button>
              <Button className="flex-1 gap-2 bg-primary text-primary-foreground">
                <Phone className="h-4 w-4" />
                Call Farmer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
