import React, { useEffect, useState } from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import { useUserProfileStore } from '@/stores/useUserProfileStore'
import AuthGuard from '@/components/AuthGuard'
import PageSection from '@/layouts/PageSection'
import Avatar from '@/components/Avatar'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'

const UserPage: React.FC = () => {
  const { user, isLoggedIn, logout } = useAccountStore()
  const {
    profile,
    isLoading,
    error,
    fetchProfile,
    refreshProfile,
    clearProfile
  } = useUserProfileStore()
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!user || !isLoggedIn) {
      clearProfile()
      return
    }

    fetchProfile(user as any)
  }, [user, isLoggedIn, fetchProfile, clearProfile])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
      console.log('Copied to clipboard:', text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const formatNpub = (npub: string): string => {
    if (!npub) return ''
    return `${npub.substring(0, 12)}...${npub.substring(npub.length - 8)}`
  }

  const ProfileField: React.FC<{
    label: string
    value?: string
    copyable?: boolean
    isLink?: boolean
  }> = ({ label, value, copyable = false, isLink = false }) => {
    if (!value) return null

    return (
      <div className="border-b border-muted pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="voice-base font-bold text-muted-foreground mb-1">
              {label}
            </h3>
            {isLink ? (
              <a
                href={value.startsWith('http') ? value : `https://${value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="voice-base text-primary hover:underline break-all"
              >
                {value}
              </a>
            ) : (
              <p className="voice-base break-all">{value}</p>
            )}
          </div>
          {copyable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(value)}
              className="flex-shrink-0"
            >
              <Icon.Copy className="size-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <PageSection width="normal">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="voice-4l">Profile</h1>
              <p className="voice-base text-muted-foreground mt-1">
                Your Nostr identity and information
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => user && refreshProfile(user as any)}
                disabled={isLoading}
              >
                <Icon.Wand className="size-4" />
                Refresh
              </Button>
              <Button variant="outline" onClick={logout}>
                <Icon.X className="size-4" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-muted-foreground">
                Loading profile...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Profile Content */}
          {!isLoading && !error && user && (
            <div className="space-y-8">
              {/* Avatar and Basic Info */}
              <div className="text-center">
                <Avatar
                  imageUrl={profile?.picture}
                  alt={profile?.displayName || profile?.name || 'User'}
                  size="xl"
                  npub={user.npub}
                  className="mx-auto mb-4"
                />
                <h2 className="voice-2l font-bold">
                  {profile?.displayName || profile?.name || 'Anonymous'}
                </h2>
                {profile?.about && (
                  <p className="voice-base text-muted-foreground mt-2 max-w-md mx-auto">
                    {profile.about}
                  </p>
                )}
              </div>

              {/* Nostr Identifiers */}
              <div className="bg-muted/20 rounded-lg p-6">
                <h3 className="voice-lg font-bold mb-4 flex items-center gap-2">
                  <Icon.Key className="size-5" />
                  Nostr Identity
                </h3>
                <div className="space-y-4">
                  <ProfileField
                    label="Public Key (npub)"
                    value={user.npub}
                    copyable
                  />
                  <ProfileField
                    label="Hex Public Key"
                    value={user.pubkey}
                    copyable
                  />
                  {profile?.nip05 && (
                    <ProfileField
                      label="Nostr Verification (NIP-05)"
                      value={profile.nip05}
                      copyable
                    />
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="voice-lg font-bold flex items-center gap-2">
                  <Icon.User className="size-5" />
                  Profile Information
                </h3>

                <ProfileField
                  label="Display Name"
                  value={profile?.displayName}
                />
                <ProfileField label="Name" value={profile?.name} />
                <ProfileField label="About" value={profile?.about} />
                <ProfileField label="Website" value={profile?.website} isLink />
              </div>

              {/* Lightning Information */}
              {(profile?.lud06 || profile?.lud16) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="voice-lg font-bold flex items-center gap-2 mb-4">
                    <Icon.Zap className="size-5 text-yellow-600 dark:text-yellow-400" />
                    Lightning Network
                  </h3>

                  {profile?.lud16 && (
                    <ProfileField
                      label="Lightning Address"
                      value={profile.lud16}
                      copyable
                    />
                  )}
                  {profile?.lud06 && (
                    <ProfileField
                      label="LNURL"
                      value={profile.lud06}
                      copyable
                    />
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="voice-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    isLink
                    to="/orders"
                    className="justify-start"
                  >
                    <Icon.ShoppingBag className="size-4" />
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    isLink
                    to="/profile"
                    className="justify-start"
                  >
                    <Icon.Wand className="size-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(user.npub)}
                    className="justify-start"
                  >
                    <Icon.Share className="size-4" />
                    Share Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(`https://njump.me/${user.npub}`, '_blank')
                    }
                    className="justify-start"
                  >
                    <Icon.Link className="size-4" />
                    View on njump
                  </Button>
                </div>
              </div>

              {/* Developer Info */}
              <details className="bg-muted/10 rounded-lg">
                <summary className="p-4 cursor-pointer voice-base font-semibold">
                  Developer Information
                </summary>
                <div className="p-4 pt-0 space-y-4 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">
                      Raw Profile Data:
                    </span>
                    <pre className="mt-2 p-3 bg-muted/20 rounded text-xs overflow-auto">
                      {JSON.stringify(profile, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </PageSection>
    </AuthGuard>
  )
}

export default UserPage
