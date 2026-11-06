import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { isValidSlug } from "@/lib/blog-slug";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();
  return <PostEditor slug={slug} />;
}
