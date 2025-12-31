import { Suspense } from "react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import { getStartupsBySlug } from "@/lib/actions/startup.actions";
import { getAuthorById } from "@/lib/actions/author.actions";

const md = markdownit();

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;

    const response = await getStartupsBySlug(slug);

    if (response.status === "NOT FOUND")
        return notFound();

    if (response.status === "ERROR")
        throw new Error(response.error);

    const post = response.startups;

    const response1 = await getAuthorById(post.authorId);

    if (response1.status === "NOT FOUND")
        return notFound();

    if (response1.status === "ERROR")
        throw new Error(response.error);

    const author = response1.authors[0];

    const parsedContent = md.render(post?.pitch || "");

    return (
        <>
            <section className="pink_container min-h-[230px]!">
                <p className="tag">{formatDate(post?.createdAt)}</p>

                <h1 className="heading">{post.title}</h1>
                <p className="sub-heading max-w-5xl!">{post.description}</p>
            </section>

            <section className="section_container">
                <img
                    src={post.image}
                    alt="thumbnail"
                    className="w-full h-auto rounded-xl"
                />

                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link
                            href={`/author/${author._id}`}
                            className="flex gap-2 items-center mb-3"
                        >
                            <Image
                                src={author.image}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="rounded-full drop-shadow-lg"
                            />

                            <div>
                                <p className="text-20-medium">{author.name}</p>
                                <p className="text-16-medium text-black-300!">
                                    @{author.username}
                                </p>
                            </div>
                        </Link>

                        <p className="category-tag">{post.category}</p>
                    </div>

                    <h3 className="text-30-bold">Pitch Details</h3>
                    {parsedContent ? (
                        <article
                            className="prose max-w-4xl font-work-sans break-all"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>

                <Suspense fallback={<Skeleton className="view_skeleton" />}>
                    <View views={post.views} />
                </Suspense>
            </section>
        </>
    );
};

export default Page;