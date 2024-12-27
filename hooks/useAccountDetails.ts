import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { Account, UseAccountDetailsReturn } from '@/types/types'

export const useAccountDetails = (
  accountId: string,
): UseAccountDetailsReturn => {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const tokenData = useAuthStore((state) => state.tokenData)

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!tokenData?.access_token) {
        setError('No access token available.')
        Alert.alert('Authentication Error', 'No access token available.')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://bridgerins.my.salesforce.com/services/data/v57.0/sobjects/Account/${accountId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error_description || 'Failed to fetch account details.',
          )
        }

        const data: Account = await response.json()
        setAccount(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
          Alert.alert('Error', err.message)
        } else {
          setError('An unknown error occurred.')
          Alert.alert('Error', 'An unknown error occurred.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchAccountDetails()
    }
  }, [accountId, tokenData])

  return { account, loading, error }
}
