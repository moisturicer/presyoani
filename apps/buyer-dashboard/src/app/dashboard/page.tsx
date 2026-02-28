'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BuyerDashboard } from '@/components/BuyerDashboard'
import { supabase } from '@/lib/supabaseClient'
import { SyncService } from '../../service/sync_service'

export const dynamic = 'force-dynamic'

let hasSyncedGlobal = false;

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {

    const loadUserData = async () => {

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error("Fetch error:", error.message)
          return
        }

        if (data) {
          setProfile(data)
          console.log('Welcome', data?.first_name)
        } else {
          console.log('data failed')
        }
      }

      console.log('test')
    };
    loadUserData()
  }, [])

  useEffect(() => {
    let isMounted = true

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return

        if (!data.user) {
          router.replace('/login')
        }
      })

    return () => {
      isMounted = false
    }
  }, [router])

  useEffect(() => {

    if (hasSyncedGlobal) return;

    const runSync = () => {
      SyncService.syncCommodities()
        .then(() => {
          hasSyncedGlobal = true;
        })
        .catch(err => console.error("Manual sync failed:", err));
    };

    runSync();

    window.addEventListener('online', runSync);

    return () => {
      window.removeEventListener('online', runSync);
    };
  }, []);



  return (

    <main className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 pb-8 pt-6">
        <header className="flex flex-col gap-3 rounded-2xl bg-card/80 px-5 py-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Buyer dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live harvest availability • Cebu
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary ring-1 ring-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live data demo
            </span>
          </div>
        </header>

        <section className="rounded-2xl bg-card/70 p-4 shadow-sm ring-1 ring-border/70 backdrop-blur-xl">
          <BuyerDashboard />
        </section>
      </div>
    </main>
  )
}
