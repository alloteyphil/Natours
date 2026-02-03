import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { authClient } from "../lib/auth-client";
import AuthGuard from "../components/AuthGuard";

const AccountContent = () => {
  const account = useQuery(api.users.getMe);
  const ensureUser = useMutation(api.users.ensureUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (account?.authUser && !account.user) {
      void ensureUser();
    }
  }, [account, ensureUser]);

  useEffect(() => {
    if (!account) {
      return;
    }
    setName(account.user?.name ?? account.authUser?.name ?? "");
    setPhoto(account.user?.photo ?? account.authUser?.image ?? "");
  }, [account]);

  const bookings = useQuery(
    api.bookings.listForUserDetailed,
    account?.user ? { userId: account.user._id } : "skip"
  );

  if (!account) {
    return (
      <div className="space-y-8">
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="h-14 w-14 animate-pulse rounded-full bg-emerald-100" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-52 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100" />
        </section>
        <section className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`booking-skeleton-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded-full bg-emerald-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      let photoStorageId: string | undefined;
      let photoUrl: string | undefined;

      // Handle file upload if a file is selected
      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        const { storageId } = await result.json();
        photoStorageId = storageId;
      } else if (photo.trim()) {
        photoUrl = photo.trim();
      }

      const { error } = await authClient.updateUser({
        name: name.trim() || undefined,
        image: photoUrl,
      });
      if (error) {
        setProfileError(error.message ?? "Unable to update profile");
        setIsSavingProfile(false);
        return;
      }
      await updateProfile({
        name: name.trim() || undefined,
        photo: photoUrl,
        photoStorageId: photoStorageId as Id<"_storage"> | undefined,
      });
      setProfileMessage("Profile updated.");
      setSelectedFile(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile";
      setProfileError(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill out both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        setPasswordError(error.message ?? "Unable to update password");
        return;
      }
      setPasswordMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update password";
      setPasswordError(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-500/20">
          <img
            src={
              account.user?.photo ??
              account.authUser?.image ??
              "/img/users/default.jpg"
            }
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {account.user?.name ?? account.authUser?.name ?? "Traveler"}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {account.user?.email ?? account.authUser?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => authClient.signOut()}
          className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:border-emerald-400/50 dark:hover:text-emerald-100"
        >
          Sign out
        </button>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Profile
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Update your display name and profile photo (upload or URL).
            </p>
          </div>
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Display name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
              />
            </label>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Profile photo
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-emerald-300 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-400/50">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{selectedFile ? selectedFile.name : "Choose file"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setPhoto("");
                    }
                  }}
                  className="hidden"
                />
              </label>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                or
              </div>
              <input
                type="url"
                value={photo}
                onChange={(event) => {
                  setPhoto(event.target.value);
                  setSelectedFile(null);
                }}
                placeholder="https://..."
                className="w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
              />
            </div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
              <input
                type="email"
                value={account.user?.email ?? account.authUser?.email ?? ""}
                readOnly
                className="mt-2 w-full rounded-xl border border-emerald-200/50 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/40 dark:text-slate-400"
              />
            </label>
            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProfile ? "Saving..." : "Save changes"}
            </button>
            {profileError && (
              <p className="text-sm text-red-500">{profileError}</p>
            )}
            {profileMessage && (
              <p className="text-sm text-emerald-600">{profileMessage}</p>
            )}
          </form>
        </div>

        <div className="rounded-2xl border border-emerald-200/70 bg-white p-6 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/60">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Security
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Change your password and revoke other sessions.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Current password
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-emerald-200/70 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-500/30 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
              />
            </label>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingPassword ? "Updating..." : "Update password"}
            </button>
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="text-sm text-emerald-600">{passwordMessage}</p>
            )}
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          My bookings
        </h2>
        {!bookings ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`booking-loading-${index}`}
                className="flex flex-col gap-3 rounded-2xl border border-emerald-200/70 bg-white px-4 py-3 dark:border-emerald-500/20 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-4 w-20 animate-pulse rounded-full bg-emerald-100 dark:bg-emerald-500/20" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">
            You have no bookings yet.
          </p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-3 rounded-2xl border border-emerald-200/70 bg-white px-4 py-3 dark:border-emerald-500/20 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {booking.tour?.name ?? "Tour"}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    ${booking.price} ·{" "}
                    {booking.paid ? "Paid" : "Pending payment"}
                  </p>
                </div>
                {booking.tour?.slug && (
                  <a
                    href={`/tours/${booking.tour.slug}`}
                    className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    View tour
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Account = () => {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
};

export default Account;
