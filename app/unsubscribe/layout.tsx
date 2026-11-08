// The unsubscribe page shows lesson prices; re-render every 5 minutes so they
// update (e.g. when the holiday special ends) without a redeploy.
export const revalidate = 300

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
