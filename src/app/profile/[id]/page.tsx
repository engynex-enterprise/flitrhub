import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProfileDetail } from "@/components/profile-detail";
import { generateGallery, getPostById } from "@/lib/mock-posts";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold">Perfil no encontrado</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          El perfil que buscas no existe o fue retirado de la plataforma.
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  const gallery = generateGallery(post);
  return <ProfileDetail post={post} gallery={gallery} />;
}

export function generateMetadata({ params }: ProfilePageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);
  if (!post) return { title: "Perfil no encontrado · flitrhub" };
  return {
    title: `${post.name} · ${post.location}, ${post.city} · flitrhub`,
    description: post.description,
  };
}
