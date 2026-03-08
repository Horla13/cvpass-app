import Link from "next/link";

interface Props {
  message: string;
  upgradeUrl?: string;
}

export function ErrorMessage({ message, upgradeUrl }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
      <p className="font-semibold mb-1">Une erreur est survenue</p>
      <p>{message}</p>
      {upgradeUrl && (
        <Link
          href={upgradeUrl}
          className="inline-block mt-3 text-brand-green font-semibold underline underline-offset-2"
        >
          Voir les offres →
        </Link>
      )}
    </div>
  );
}
