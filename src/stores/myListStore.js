import { create } from 'zustand'
import { useAuthStore } from './authStore'
import { useEffect, useMemo } from 'react'
import { useAuth } from './authStore'

const createItemKey = (tmdbId, mediaType) => `${mediaType}-${tmdbId}`

export const useMyListStore = create((set, get) => ({
  myList: new Set(),
  myListMetaData: new Map(),
  loading: false,

  // Derived selector helper
  getMyListArray() {
    const { myList, myListMetaData } = get()
    return Array.from(myList)
      .map((key) => {
        const metadata = myListMetaData.get(key)
        return {
          id: key,
          tmdbId: metadata?.tmdbId,
          mediaType: metadata?.mediaType,
          addedAt: metadata?.addedAt,
        }
      })
      .filter((item) => item.tmdbId)
  },

  reset() {
    set({ myList: new Set(), myListMetaData: new Map() })
  },

  async fetchMyList() {
    const { isAuthenticated, user } = useAuthStore.getState()
    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`

    if (!isAuthenticated || !user) {
      get().reset()
      return
    }

    try {
      set({ loading: true })
      const response = await fetch(`${API_BASE_URL}/retrieve`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const favorites = data.favorites || []

      const newMyListIds = new Set()
      const metadata = new Map()
      favorites.forEach((fav) => {
        const key = createItemKey(fav.tmdb_id, fav.media_type)
        newMyListIds.add(key)
        metadata.set(key, {
          tmdbId: parseInt(fav.tmdb_id),
          mediaType: fav.media_type,
        })
      })

      set({ myList: newMyListIds, myListMetaData: metadata })
    } catch {
      // reset on error to a safe state
      get().reset()
    } finally {
      set({ loading: false })
    }
  },

  async addToMyList({ tmdbId, mediaType = 'movie' }) {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) throw new Error('Must be authenticated to add to My List')

    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`
    const itemKey = createItemKey(tmdbId, mediaType)

    if (get().myList.has(itemKey)) return { success: true, message: 'Already in My List' }

    try {
      set({ loading: true })

      // optimistic
      set((state) => ({
        myList: new Set([...state.myList, itemKey]),
        myListMetaData: new Map([
          ...state.myListMetaData,
          [itemKey, { tmdbId, mediaType }],
        ]),
      }))

      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ tmdb_id: tmdbId.toString(), media_type: mediaType }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        // rollback
        set((state) => {
          const nextSet = new Set(state.myList)
          nextSet.delete(itemKey)
          const nextMeta = new Map(state.myListMetaData)
          nextMeta.delete(itemKey)
          return { myList: nextSet, myListMetaData: nextMeta }
        })
        throw new Error(`Add failed: ${response.status} ${errorText}`)
      }

      // ensure metadata is set
      set((state) => ({
        myListMetaData: new Map([
          ...state.myListMetaData,
          [itemKey, { tmdbId, mediaType }],
        ]),
      }))

      return { success: true, message: 'Added to My List' }
    } finally {
      set({ loading: false })
    }
  },

  async removeFromMyList({ tmdbId, mediaType = 'movie' }) {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) throw new Error('Must be authenticated to remove from My List')

    const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`
    const itemKey = createItemKey(tmdbId, mediaType)

    if (!get().myList.has(itemKey)) return { success: true, message: 'Not in My List' }

    try {
      set({ loading: true })

      // optimistic removal
      const prevMeta = get().myListMetaData.get(itemKey)
      set((state) => {
        const nextSet = new Set(state.myList)
        nextSet.delete(itemKey)
        const nextMeta = new Map(state.myListMetaData)
        nextMeta.delete(itemKey)
        return { myList: nextSet, myListMetaData: nextMeta }
      })

      const response = await fetch(`${API_BASE_URL}/delete/${tmdbId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ tmdb_id: tmdbId.toString(), media_type: mediaType }),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        // rollback
        set((state) => ({
          myList: new Set([...state.myList, itemKey]),
          myListMetaData: new Map([
            ...state.myListMetaData,
            [itemKey, prevMeta || { tmdbId, mediaType }],
          ]),
        }))
        throw new Error(`Delete failed: ${response.status} ${errorText}`)
      }

      return { success: true, message: 'Removed from My List' }
    } finally {
      set({ loading: false })
    }
  },

  isInMyList(tmdbId, mediaType = 'movie') {
    const key = createItemKey(tmdbId, mediaType)
    return get().myList.has(key)
  },
}))


export const useMyList = () => {
  // Select raw references; derive array with useMemo to keep snapshot stable
  const myListSet = useMyListStore((s) => s.myList)
  const myListMetaData = useMyListStore((s) => s.myListMetaData)
  const loading = useMyListStore((s) => s.loading)
  const addToMyList = useMyListStore((s) => s.addToMyList)
  const removeFromMyList = useMyListStore((s) => s.removeFromMyList)
  const isInMyList = useMyListStore((s) => s.isInMyList)
  const fetchMyList = useMyListStore((s) => s.fetchMyList)
  const reset = useMyListStore((s) => s.reset)

  const myList = useMemo(() => {
    return Array.from(myListSet)
      .map((key) => {
        const metadata = myListMetaData.get(key)
        return {
          id: key,
          tmdbId: metadata?.tmdbId,
          mediaType: metadata?.mediaType,
          addedAt: metadata?.addedAt,
        }
      })
      .filter((item) => item.tmdbId)
  }, [myListSet, myListMetaData])

  // Side-effect helper: components can call this to sync after auth changes
  const useSyncWithAuth = () => {
    const { isAuthenticated, user } = useAuth()
    const userId = user?.id ?? null
    useEffect(() => {
      if (isAuthenticated && userId) fetchMyList()
      else reset()
      // Only react to primitive identity changes to avoid churn
    }, [isAuthenticated, userId])
  }

  return { myList, loading, addToMyList, removeFromMyList, isInMyList, fetchMyList, useSyncWithAuth }
}