import { cn, formatDate } from "@/lib/utils"
import { EyeIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { IStartup } from "@/database/startup.model"
import { IAuthor } from "@/database/author.model"
import { Skeleton } from "./ui/skeleton"

export type StartupTypeCard = Omit<IStartup, "author"> & { author?: IAuthor };

const StartupCard = ({ post }: { post: IStartup }) => {
    const { createdAt, views, author, authorId, title, category, slug, image, description } = post;

    return (
        <li className="startup-card group">
            <div className="flex-between">
                <p className="startup_card_date">
                    {formatDate(createdAt.toString())}
                </p>

                <div className="flex gap-1.5">
                    <EyeIcon className="size-6 text-primary" />
                    <span className="text-16-medium">{views}</span>
                </div>
            </div>

            <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/author/${authorId}`}>
                        <p className="text-16-medium line-clamp-1">{author}</p>
                    </Link>

                    <Link href={`/startup/${slug}`}>
                        <h3 className="text-26-semibold line-clamp-1">{title}</h3>
                    </Link>
                </div>

                <Link href={`/author/${authorId}`}>
                    <Image src="https://placehold.co/48x48" alt="placeholder" width={48} height={48} className="rounded-full" />
                </Link>
            </div>

            <Link href={`/startup/${slug}`}>
                <p className="startup-card_desc">
                    {description}
                </p>

                <Image src={image} alt="placeholder" className="startup-card_img" width={400} height={164} />
            </Link>

            <div className="flex-between gap-3 mt-5">
                <Link href={`/?query=${category.toLowerCase()}`}>
                    <p className="text-16-medium">{category}</p>
                </Link>
                <Button className="startup-card_btn" asChild>
                    <Link href={`/startup/${slug}`}>
                        Details
                    </Link>
                </Button>
            </div>
        </li>
    )
}

export const StartupCardSkeleton = () => (
    <>
        {[0, 1, 2, 3, 4].map((index: number) => (
            <li key={cn("skeleton", index)}>
                <Skeleton className="startup-card_skeleton" />
            </li>
        ))}
    </>
);

export default StartupCard