import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

import AuthorStartups from "@/components/AuthorStartups";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { getAuthorById } from "@/lib/actions/author.actions";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const session = await auth();

    const response = await getAuthorById(id);

    if (response.status === "NOT FOUND") return notFound();

    if (response.status === "ERROR") throw new Error(response.error);

    const { author } = response;

    return (
        <>
            <section className="profile_container" >
                <div className="profile_card" >
                    <div className="profile_title" >
                        <h3 className="text-24-black uppercase text-center line-clamp-1" >
                            {author.name}
                        </h3>
                    </div>

                    < Image
                        src={author.image}
                        alt={author.name}
                        width={220}
                        height={220}
                        className="profile_image"
                    />

                    <p className="text-30-extrabold mt-7 text-center" >
                        @{author?.username}
                    </p>
                    < p className="mt-1 text-center text-14-normal" > {author?.bio} </p>
                </div>

                < div className="flex-1 flex flex-col gap-5 lg:-mt-5" >
                    <p className="text-30-bold" >
                        {session?.user?.email === author.email ? "Your" : "All"
                        } Startups
                    </p>
                    < ul className="card_grid-sm" >
                        <Suspense fallback={<StartupCardSkeleton />}>
                            <AuthorStartups id={id} />
                        </Suspense>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Page;