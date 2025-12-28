import { auth } from "@/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import AuthorStartups from "@/components/AuthorStartups";
import { Suspense } from "react";
// import { Heading1 } from "lucide-react";
import { StartupCardSkeleton } from "@/components/StartupCard";

// export const experimental_ppr = true;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    const session = await auth();

    const response = await fetch(`${BASE_URL}/api/author/${id}`);

    if (response.status === 404) return notFound();

    const { author, authorEmail } = await response.json();

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
                        {session?.user?.email === authorEmail ? "Your" : "All"
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