import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { PostDetail } from "@/features/posts";
import { generateGallery, getPostById } from "@/features/posts/data/mock-posts";

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold">Publicación no encontrada</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          La publicación que buscas no existe o fue retirada de la plataforma.
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  const gallery = generateGallery(post);
  return <PostDetail post={post} gallery={gallery} />;
}

export function generateMetadata({ params }: PostPageProps) {
  const id = decodeURIComponent(params.id);
  const post = getPostById(id);
  if (!post) return { title: "Publicación no encontrada · flitrhub" };
  return {
    title: `${post.name} · ${post.location}, ${post.city} · flitrhub`,
    description: post.description,
  };
}
