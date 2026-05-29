import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { ProviderPublicProfile } from "@/features/profile/components/provider-public-profile";
import { getPostById } from "@/features/posts/data/mock-posts";

interface ProviderPageProps {
  params: { id: string };
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold">Perfil no encontrado</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          El anunciante que buscas no existe o ya no está disponible.
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  return <ProviderPublicProfile post={post} />;
}

export function generateMetadata({ params }: ProviderPageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);
  if (!post) return { title: "Perfil no encontrado · flitrhub" };
  return {
    title: `${post.name} · Perfil del anunciante · flitrhub`,
    description: post.description,
  };
}
